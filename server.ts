import "dotenv/config";
import express from "express";
import path from "path";
import cors from "cors";
import fs from "fs";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Firebase Admin safely
  if (!getApps().length) {
    try {
      const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
      if (serviceAccountJson) {
        const serviceAccount = JSON.parse(serviceAccountJson);
        initializeApp({
          credential: cert(serviceAccount)
        });
      } else {
        console.warn("FIREBASE_SERVICE_ACCOUNT env var is missing. Webhooks won't be able to update Firestore.");
      }
    } catch (error) {
      console.error("Error initializing Firebase Admin:", error);
    }
  }

  const getDb = () => {
    if (!getApps().length) return null;
    return getFirestore();
  };

  // General body parsing for all endpoints - support heavy payloads, base64 images and large articles
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(cors());

  // Health check endpoint for connectivity checks and dev server monitoring
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: Date.now() });
  });

  // Proxy for Quran audio files to avoid browser CORS restrictions during Web Audio decoding
  app.get("/api/quran-audio-proxy", async (req, res) => {
    try {
      const { url } = req.query;
      if (!url || typeof url !== "string") {
        return res.status(400).json({ error: "Missing url parameter" });
      }

      const allowedHosts = [
        "cdn.islamic.network",
        "everyayah.com",
        "download.quranicaudio.com",
        "audio.qurancdn.com",
        "translate.google.com",
        "gstatic.com",
        "google.com",
        "server8.mp3quran.net",
        "server11.mp3quran.net",
        "server6.mp3quran.net",
        "server7.mp3quran.net",
        "server10.mp3quran.net",
        "server12.mp3quran.net",
        "server13.mp3quran.net",
        "server14.mp3quran.net"
      ];

      const targetUrl = new URL(url);
      const hostAllowed = allowedHosts.some(h => targetUrl.hostname.includes(h));
      if (!hostAllowed) {
        return res.status(403).json({ error: "Host not allowed for proxy" });
      }

      const audioRes = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!audioRes.ok) {
        return res.status(audioRes.status).send("Failed to fetch audio from source");
      }

      const arrayBuffer = await audioRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      res.setHeader("Content-Type", audioRes.headers.get("content-type") || "audio/mpeg");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cache-Control", "public, max-age=604800");
      res.send(buffer);
    } catch (error: any) {
      console.error("Quran audio proxy error:", error);
      res.status(500).send("Error proxying audio");
    }
  });

  // Server-side in-memory cache for translations to avoid repeated API calls
  const translationCache = new Map<string, any>();
  const MAX_CACHE_SIZE = 1000;

  const getCachedTranslation = (key: string) => translationCache.get(key);
  const setCachedTranslation = (key: string, data: any) => {
    if (translationCache.size >= MAX_CACHE_SIZE) {
      const firstKey = translationCache.keys().next().value;
      if (firstKey) translationCache.delete(firstKey);
    }
    translationCache.set(key, data);
  };

  // Helper for pacing Gemini API calls to prevent quota bursts
  let lastCallTimestamp = 0;
  const MIN_CALL_INTERVAL_MS = 350;
  let callQueue: Promise<any> = Promise.resolve();

  const throttledGenerate = async <T>(fn: () => Promise<T>): Promise<T> => {
    const execute = async () => {
      const now = Date.now();
      const elapsed = now - lastCallTimestamp;
      if (elapsed < MIN_CALL_INTERVAL_MS) {
        await new Promise(r => setTimeout(r, MIN_CALL_INTERVAL_MS - elapsed));
      }
      lastCallTimestamp = Date.now();
      return await fn();
    };

    const resultPromise = callQueue.then(execute, execute);
    callQueue = resultPromise.then(() => {}, () => {});
    return await resultPromise;
  };

  // Multi-API Pool Configuration & Failover Cascade System
  interface AiApiKeyConfig {
    id: string;
    name: string;
    provider: 'gemini' | 'inception' | 'openai' | 'groq' | 'mistral' | 'deepseek' | 'openrouter' | 'custom';
    apiKey: string;
    model: string;
    baseUrl?: string;
    active: boolean;
    priority: number;
    createdAt: number;
    lastUsedAt?: number;
    lastSuccessAt?: number;
    lastErrorAt?: number;
    lastErrorMessage?: string;
    cooldownUntil?: number;
    totalCalls?: number;
    successCalls?: number;
    failedCalls?: number;
  }

  const AI_POOL_FILE = path.join(process.cwd(), "ai_api_pool.json");
  let aiPool: AiApiKeyConfig[] = [];

  // Inception Labs Configuration (mercury-2.5 fallback)
  const INCEPTION_API_URL = process.env.INCEPTION_API_URL || "https://api.inceptionlabs.ai/v1/chat/completions";
  const INCEPTION_API_KEY = process.env.INCEPTION_API_KEY || "sk_517b151f22cdafd18d22acdf60d13cf1";
  const INCEPTION_MODEL = process.env.INCEPTION_MODEL || "mercury-2.5";

  // Robust JSON extractor for LLM outputs
  const cleanJsonText = (raw: string): string => {
    let cleaned = (raw || "").trim();
    const codeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch) {
      cleaned = codeBlockMatch[1].trim();
    }
    if (!cleaned.startsWith("{") && !cleaned.startsWith("[")) {
      const firstBrace = cleaned.indexOf("{");
      const lastBrace = cleaned.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleaned = cleaned.substring(firstBrace, lastBrace + 1);
      } else {
        const firstBracket = cleaned.indexOf("[");
        const lastBracket = cleaned.lastIndexOf("]");
        if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
          cleaned = cleaned.substring(firstBracket, lastBracket + 1);
        }
      }
    }
    return cleaned;
  };

  // Helper to persist the AI Pool to disk and Firestore
  const saveAiPoolAsync = async () => {
    try {
      fs.writeFileSync(AI_POOL_FILE, JSON.stringify(aiPool, null, 2), "utf-8");
    } catch (e) {
      console.error("[AI Pool] Error saving to local file:", e);
    }
    try {
      const adminDb = getDb();
      if (adminDb) {
        await adminDb.collection("settings").doc("ai_api_pool").set({
          keys: aiPool,
          updatedAt: Date.now()
        }, { merge: true });
      }
    } catch (e) {
      // Non-fatal if firestore not available
    }
  };

  // Load AI Pool on initialization
  const loadAiPool = async () => {
    try {
      if (fs.existsSync(AI_POOL_FILE)) {
        const raw = fs.readFileSync(AI_POOL_FILE, "utf-8");
        aiPool = JSON.parse(raw);
        console.log(`[AI Pool] Loaded ${aiPool.length} API keys from local file.`);
      }
    } catch (e) {
      console.warn("[AI Pool] Could not read local file, checking Firestore:", e);
    }

    try {
      const adminDb = getDb();
      if (adminDb) {
        const snap = await adminDb.collection("settings").doc("ai_api_pool").get();
        if (snap.exists) {
          const data = snap.data();
          if (data?.keys && Array.isArray(data.keys) && data.keys.length > 0) {
            aiPool = data.keys;
            console.log(`[AI Pool] Synced ${aiPool.length} keys from Firestore.`);
            try {
              fs.writeFileSync(AI_POOL_FILE, JSON.stringify(aiPool, null, 2), "utf-8");
            } catch (err) {}
          }
        }
      }
    } catch (e) {
      // Ignored
    }

    // Seed defaults if empty
    if (!aiPool || aiPool.length === 0) {
      let seedPriority = 1;
      if (INCEPTION_API_KEY) {
        aiPool.push({
          id: "key_inception_default",
          name: "Inception Labs (Mercury 2.5 - Prioritaire)",
          provider: "inception",
          apiKey: INCEPTION_API_KEY,
          model: INCEPTION_MODEL || "mercury-2.5",
          baseUrl: INCEPTION_API_URL,
          active: true,
          priority: seedPriority++,
          createdAt: Date.now()
        });
      }
      if (process.env.GEMINI_API_KEY) {
        aiPool.push({
          id: "key_gemini_default",
          name: "Google Gemini (Flash Lite - Relais)",
          provider: "gemini",
          apiKey: process.env.GEMINI_API_KEY,
          model: "gemini-3.1-flash-lite",
          active: true,
          priority: seedPriority++,
          createdAt: Date.now()
        });
      }
      if (aiPool.length > 0) {
        try {
          fs.writeFileSync(AI_POOL_FILE, JSON.stringify(aiPool, null, 2), "utf-8");
        } catch (e) {}
      }
    }
  };

  // Trigger loading immediately
  loadAiPool().catch(console.error);

  // Check if any AI key is configured and ready
  const hasAvailableAiKey = (): boolean => {
    if (aiPool && aiPool.some(k => k.active && k.apiKey && k.apiKey.trim().length > 0)) {
      return true;
    }
    return !!process.env.GEMINI_API_KEY || !!INCEPTION_API_KEY;
  };

  // Check if an error signifies quota / token exhaustion / rate limit
  const isQuotaOrRateLimitError = (err: any): boolean => {
    if (!err) return false;
    const status = err.status || err.statusCode;
    if (status === 429 || status === 402 || status === 403 || status === 503) return true;
    const msg = (err.message || String(err)).toLowerCase();
    return (
      msg.includes("429") ||
      msg.includes("resource_exhausted") ||
      msg.includes("quota") ||
      msg.includes("rate limit") ||
      msg.includes("rate_limit") ||
      msg.includes("tokens") ||
      msg.includes("credit") ||
      msg.includes("insufficient_quota") ||
      msg.includes("overloaded") ||
      msg.includes("exhausted")
    );
  };

  // Execute a single AI call on a specific key configuration
  const executeAiCall = async (key: AiApiKeyConfig, promptText: string, isJson: boolean): Promise<string> => {
    const provider = key.provider || 'gemini';
    const apiKey = key.apiKey?.trim();

    if (!apiKey) {
      throw new Error(`Clé API vide pour le fournisseur ${provider} (${key.name})`);
    }

    if (provider === 'gemini') {
      const geminiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      const modelToUse = key.model || 'gemini-3.1-flash-lite';
      const res = await throttledGenerate(() => geminiClient.models.generateContent({
        model: modelToUse,
        contents: promptText,
        ...(isJson ? { config: { responseMimeType: "application/json" } } : {})
      }));
      let text = res?.text || "";
      if (isJson) {
        text = cleanJsonText(text);
      }
      return text;
    }

    if (provider === 'inception') {
      const url = key.baseUrl || INCEPTION_API_URL;
      const messages: any[] = [];
      if (isJson) {
        messages.push({
          role: "system",
          content: "You are a specialized spiritual, philosophical, and linguistic AI assistant. You must output ONLY a valid JSON object matching the requested schema, with no introductory text, no markdown backticks, and no trailing comments."
        });
      }
      messages.push({ role: "user", content: promptText });

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: key.model || "mercury-2.5",
          reasoning_effort: "low",
          messages
        })
      });

      if (!response.ok) {
        const errBody = await response.text();
        const err: any = new Error(`Inception error ${response.status}: ${errBody.slice(0, 250)}`);
        err.status = response.status;
        throw err;
      }

      const data: any = await response.json();
      let content = data?.choices?.[0]?.message?.content || "";
      if (isJson) {
        content = cleanJsonText(content);
      }
      return content;
    }

    // OpenAI, Groq, Mistral, DeepSeek, OpenRouter, or Custom OpenAI-compatible
    let defaultUrl = "https://api.openai.com/v1/chat/completions";
    let defaultModel = "gpt-4o-mini";
    if (provider === 'groq') {
      defaultUrl = "https://api.groq.com/openai/v1/chat/completions";
      defaultModel = "llama-3.3-70b-versatile";
    } else if (provider === 'mistral') {
      defaultUrl = "https://api.mistral.ai/v1/chat/completions";
      defaultModel = "mistral-small-latest";
    } else if (provider === 'deepseek') {
      defaultUrl = "https://api.deepseek.com/chat/completions";
      defaultModel = "deepseek-chat";
    } else if (provider === 'openrouter') {
      defaultUrl = "https://openrouter.ai/api/v1/chat/completions";
      defaultModel = "google/gemini-2.5-flash";
    }

    const url = key.baseUrl || defaultUrl;
    const model = key.model || defaultModel;

    const messages: any[] = [];
    if (isJson) {
      messages.push({
        role: "system",
        content: "You are a specialized spiritual and philosophical assistant. You must output ONLY a valid JSON object matching the requested schema with no surrounding text."
      });
    }
    messages.push({ role: "user", content: promptText });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages,
        ...(isJson ? { response_format: { type: "json_object" } } : {})
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      const err: any = new Error(`${provider.toUpperCase()} error HTTP ${response.status}: ${errBody.slice(0, 250)}`);
      err.status = response.status;
      throw err;
    }

    const data: any = await response.json();
    let content = data?.choices?.[0]?.message?.content || "";
    if (isJson) {
      content = cleanJsonText(content);
    }
    return content;
  };

  // Dedicated Inception Labs API client for mercury-2.5 (legacy wrapper)
  const callInceptionAI = async (prompt: string, isJson = false, retries = 2): Promise<{ text: string }> => {
    const apiKey = INCEPTION_API_KEY;
    if (!apiKey) {
      throw new Error("Inception Labs API key is not configured");
    }

    const messages: Array<{ role: string; content: string }> = [];
    if (isJson) {
      messages.push({
        role: "system",
        content: "You are a specialized spiritual, philosophical, and linguistic AI assistant. You must output ONLY a valid JSON object matching the requested schema, with no introductory text, no markdown backticks, and no trailing comments."
      });
    }

    messages.push({
      role: "user",
      content: prompt
    });

    let lastError: any = null;
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await fetch(INCEPTION_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: INCEPTION_MODEL,
            reasoning_effort: "low",
            messages
          })
        });

        if (!response.ok) {
          const errBody = await response.text();
          throw new Error(`Inception API status ${response.status}: ${errBody.slice(0, 200)}`);
        }

        const data: any = await response.json();
        let content = data?.choices?.[0]?.message?.content || "";
        if (isJson) {
          content = cleanJsonText(content);
        }
        return { text: content };
      } catch (err: any) {
        lastError = err;
        console.warn(`[Inception Labs API] Attempt ${attempt + 1}/${retries} failed:`, err?.message || err);
        if (attempt < retries - 1) {
          await new Promise(r => setTimeout(r, 400 * (attempt + 1)));
        }
      }
    }

    throw lastError || new Error("Inception Labs AI failed after retries");
  };

  // Primary AI dispatch: Multi-API Cascade Pool with automatic Quota/Token Failover
  const generateWithRetry = async (ai: GoogleGenAI | null, params: any, retries = 3): Promise<{ text: string }> => {
    const isJson = params?.config?.responseMimeType === "application/json";
    const promptText = typeof params.contents === "string"
      ? params.contents
      : Array.isArray(params.contents)
      ? params.contents.map((c: any) => typeof c === "string" ? c : c?.text || JSON.stringify(c)).join("\n")
      : String(params.contents || "");

    // 1. Try configured AI Pool with priority cascade
    const activeKeys = aiPool
      .filter(k => k.active && k.apiKey && k.apiKey.trim().length > 0)
      .sort((a, b) => a.priority - b.priority);

    if (activeKeys.length > 0) {
      const now = Date.now();
      // Filter out keys in cooldown, unless ALL keys are currently in cooldown
      let candidates = activeKeys.filter(k => !k.cooldownUntil || k.cooldownUntil < now);
      if (candidates.length === 0) {
        console.warn("[AI Pool] Toutes les clés étaient en cooldown (quota). Réinitialisation d'urgence pour tenter la requête...");
        candidates = activeKeys;
      }

      for (const key of candidates) {
        try {
          console.log(`[AI Cascade] Tentative avec l'API #${key.priority} "${key.name}" (${key.provider} / ${key.model || 'défaut'})...`);
          const startTime = Date.now();
          const text = await executeAiCall(key, promptText, isJson);
          const duration = Date.now() - startTime;

          // Record success statistics
          key.totalCalls = (key.totalCalls || 0) + 1;
          key.successCalls = (key.successCalls || 0) + 1;
          key.lastUsedAt = Date.now();
          key.lastSuccessAt = Date.now();
          key.cooldownUntil = undefined;
          saveAiPoolAsync();

          console.log(`[AI Cascade] ✓ Succès avec l'API #${key.priority} "${key.name}" en ${duration}ms`);
          return { text };
        } catch (err: any) {
          const isQuota = isQuotaOrRateLimitError(err);
          key.totalCalls = (key.totalCalls || 0) + 1;
          key.failedCalls = (key.failedCalls || 0) + 1;
          key.lastErrorAt = Date.now();
          key.lastErrorMessage = err?.message || String(err);

          if (isQuota) {
            // Set 5-minute cooldown
            key.cooldownUntil = Date.now() + 5 * 60 * 1000;
            console.warn(`[AI Pool Relais Quota] ⚠️ API #${key.priority} "${key.name}" (${key.provider}) : QUOTA / TOKENS ÉPUISÉS (${err.message}). Cooldown 5min activé. BASCULEMENT IMMÉDIAT vers l'API suivante...`);
          } else {
            console.warn(`[AI Cascade] API #${key.priority} "${key.name}" (${key.provider}) en échec : ${err.message}. Basculement vers l'API suivante...`);
          }
          saveAiPoolAsync();
          // Continue to next key in loop!
        }
      }
      console.warn(`[AI Cascade] Toutes les ${candidates.length} API du pool ont échoué. Évaluation du fallback par défaut...`);
    }

    // 2. Legacy fallback to Inception Labs API (mercury-2.5) if pool failed or empty
    if (INCEPTION_API_KEY) {
      try {
        const res = await callInceptionAI(promptText, isJson);
        if (res && res.text) {
          return res;
        }
      } catch (inceptionErr: any) {
        console.warn("[Inception Labs API] Fallback provider error:", inceptionErr?.message || inceptionErr);
      }
    }

    // 3. Legacy fallback to Gemini API if configured
    if (ai) {
      const fallbackModels = ["gemini-3.8-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
      let currentModelIndex = 0;
      if (params.model) {
        const idx = fallbackModels.indexOf(params.model);
        if (idx !== -1) currentModelIndex = idx;
      }

      let lastError: any = null;
      for (let i = 0; i < retries; i++) {
        const modelToUse = fallbackModels[currentModelIndex % fallbackModels.length];
        const currentParams = { ...params, model: modelToUse };
        try {
          const res = await throttledGenerate(() => ai.models.generateContent(currentParams));
          return { text: res?.text || "" };
        } catch (error: any) {
          lastError = error;
          const errMsg = error?.message || "";
          const errStatus = error?.status;
          const isRateLimit = errStatus === 429 || errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED");
          const isUnavailable = errStatus === 503 || errMsg.includes("503") || errMsg.includes("Overloaded") || errMsg.includes("UNAVAILABLE");
          const isTransient = isRateLimit || isUnavailable || errStatus === 500 || errStatus === 504;

          if (isRateLimit || isUnavailable || isTransient) {
            currentModelIndex = (currentModelIndex + 1) % fallbackModels.length;
          }
          if (i === retries - 1 || !isTransient) {
            throw error;
          }
          await new Promise(r => setTimeout(r, 400 * Math.pow(1.3, i)));
        }
      }
      throw lastError || new Error("Gemini fallback failed");
    }

    throw new Error("Toutes les API configurées ont échoué ou ont épuisé leurs quotas.");
  };

  // ADMIN API POOL MANAGEMENT ROUTES
  // 1. Get current pool list
  app.get("/api/admin/ai-pool", (req, res) => {
    try {
      const now = Date.now();
      const sanitizedKeys = aiPool.map(k => ({
        ...k,
        isCooldown: !!(k.cooldownUntil && k.cooldownUntil > now),
        cooldownRemainingSeconds: k.cooldownUntil && k.cooldownUntil > now ? Math.round((k.cooldownUntil - now) / 1000) : 0,
        maskedKey: k.apiKey ? (k.apiKey.length > 10 ? `${k.apiKey.slice(0, 6)}...${k.apiKey.slice(-4)}` : '••••••••') : ''
      }));

      res.json({
        keys: sanitizedKeys,
        totalCount: aiPool.length,
        activeCount: aiPool.filter(k => k.active && (!k.cooldownUntil || k.cooldownUntil <= now)).length,
        inCooldownCount: aiPool.filter(k => k.active && k.cooldownUntil && k.cooldownUntil > now).length,
        defaultEnvGemini: !!process.env.GEMINI_API_KEY,
        defaultEnvInception: !!INCEPTION_API_KEY
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 2. Save / Update pool list
  app.post("/api/admin/ai-pool", async (req, res) => {
    try {
      const { keys } = req.body;
      if (!Array.isArray(keys)) {
        return res.status(400).json({ error: "Le paramètre 'keys' doit être un tableau." });
      }

      // Map incoming keys and preserve existing statistics
      aiPool = keys.map((incoming, index) => {
        const existing = aiPool.find(e => e.id === incoming.id);
        const resolvedApiKey = incoming.apiKey ? incoming.apiKey.trim() : (existing?.apiKey || '');
        return {
          id: incoming.id || `key_${Date.now()}_${index}`,
          name: (incoming.name || `API #${index + 1}`).trim(),
          provider: incoming.provider || 'gemini',
          apiKey: resolvedApiKey,
          model: (incoming.model || (incoming.provider === 'inception' ? 'mercury-2.5' : 'gemini-3.1-flash-lite')).trim(),
          baseUrl: incoming.baseUrl ? incoming.baseUrl.trim() : undefined,
          active: incoming.active !== false,
          priority: typeof incoming.priority === 'number' ? incoming.priority : index + 1,
          createdAt: incoming.createdAt || existing?.createdAt || Date.now(),
          lastUsedAt: existing?.lastUsedAt,
          lastSuccessAt: existing?.lastSuccessAt,
          lastErrorAt: existing?.lastErrorAt,
          lastErrorMessage: existing?.lastErrorMessage,
          cooldownUntil: existing?.cooldownUntil,
          totalCalls: existing?.totalCalls || 0,
          successCalls: existing?.successCalls || 0,
          failedCalls: existing?.failedCalls || 0
        };
      });

      // Sort by priority
      aiPool.sort((a, b) => a.priority - b.priority);

      // Re-assign 1-based sequential priorities
      aiPool.forEach((k, idx) => {
        k.priority = idx + 1;
      });

      await saveAiPoolAsync();

      console.log(`[AI Pool] Saved ${aiPool.length} API keys via Admin Panel.`);
      res.json({
        success: true,
        count: aiPool.length,
        keys: aiPool.map(k => ({
          ...k,
          maskedKey: k.apiKey ? (k.apiKey.length > 10 ? `${k.apiKey.slice(0, 6)}...${k.apiKey.slice(-4)}` : '••••••••') : ''
        }))
      });
    } catch (err: any) {
      console.error("[AI Pool] Error saving pool:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // 3. Test a key live
  app.post("/api/admin/ai-pool/test", async (req, res) => {
    try {
      const { keyId, provider, apiKey, model, baseUrl } = req.body;
      let targetKey: AiApiKeyConfig | undefined;

      if (keyId) {
        targetKey = aiPool.find(k => k.id === keyId);
      }

      if (!targetKey && apiKey) {
        targetKey = {
          id: "temp_test",
          name: "Test Direct",
          provider: provider || 'gemini',
          apiKey: apiKey.trim(),
          model: model ? model.trim() : (provider === 'inception' ? 'mercury-2.5' : 'gemini-3.1-flash-lite'),
          baseUrl: baseUrl ? baseUrl.trim() : undefined,
          active: true,
          priority: 999,
          createdAt: Date.now()
        };
      }

      if (!targetKey || !targetKey.apiKey) {
        return res.status(400).json({ error: "Aucune clé API fournie pour le test." });
      }

      const startTime = Date.now();
      const testPrompt = "Test de connectivité API spirituelle. Réponds uniquement par le mot 'ALHAMDOULILLAH' en majuscules.";
      const sampleText = await executeAiCall(targetKey, testPrompt, false);
      const latencyMs = Date.now() - startTime;

      res.json({
        success: true,
        latencyMs,
        response: sampleText.trim().slice(0, 100),
        provider: targetKey.provider,
        model: targetKey.model
      });
    } catch (err: any) {
      console.error("[AI Pool Test] Error testing key:", err);
      const isQuota = isQuotaOrRateLimitError(err);
      res.status(err.status && err.status >= 400 && err.status < 600 ? err.status : 500).json({
        success: false,
        error: err.message || String(err),
        isQuotaExceeded: isQuota
      });
    }
  });

  // 4. Reset cooldowns and quotas
  app.post("/api/admin/ai-pool/reset-cooldown", async (req, res) => {
    try {
      const { keyId } = req.body || {};
      if (keyId) {
        const k = aiPool.find(item => item.id === keyId);
        if (k) {
          k.cooldownUntil = undefined;
          k.lastErrorMessage = undefined;
        }
      } else {
        aiPool.forEach(k => {
          k.cooldownUntil = undefined;
          k.lastErrorMessage = undefined;
        });
      }
      await saveAiPoolAsync();
      res.json({ success: true, message: "Quotas et cooldowns réinitialisés avec succès." });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // AI Quran Tafsir & Spiritual Secrets (Asrar)
  app.post("/api/quran/tafsir", async (req, res) => {
    try {
      const { surahNumber, surahName, ayahNumber, arabicText, translationText, language } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!hasAvailableAiKey()) {
        return res.status(500).json({ error: "Aucun service d'IA n'est configuré ou actif" });
      }

      const ai = apiKey ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      }) : null;

      const langName = language === 'en' ? 'English' : language === 'ha' ? 'Hausa (or French if accurate Hausa terms for exegesis are missing)' : 'French';

      const prompt = `
Vous êtes un exégète coranique d'une immense érudition et un guide spirituel islamique accompli (expert en "Asrar" - secrets spirituels et bienfaits des lettres et versets).
Analysez le verset suivant :
- Sourate : ${surahNumber} (${surahName || "Inconnue"})
- Verset (Ayah) : ${ayahNumber}
- Texte Arabe : ${arabicText}
- Traduction fournie : ${translationText || "Non fournie"}

Tâche :
Générez un contenu extrêmement riche, détaillé, précis et inspirant rédigé entièrement en ${langName} pour l'application spirituelle AsrarHub.
Le résultat doit correspondre STRICTEMENT à la structure JSON spécifiée ci-dessous.

RÈGLES CRUCIALES DE TRADUCTION ET GÉNÉRATION (SANS TRANSLITTÉRATION) :
1. PAS DE TRANSLITTÉRATION : Ne générez JAMAIS de translittération phonétique latine pour les versets coraniques, les invocations ou les mots arabes (ex: ne pas écrire "Wadammarnā..." ou d'autres mots arabes écrits avec l'alphabet latin).
2. ARABE ORIGINAL : Écrivez TOUJOURS les versets et les invocations directement en alphabet arabe original (avec tashkeel complet si possible).
3. TRADUCTION DIRECTE : Fournissez une traduction claire, fluide et entièrement en ${langName} (Français/English/Hausa) juste en dessous du texte arabe original, sans insérer de mots translittérés de l'arabe.

Champs requis dans le JSON final :
1. "exegesis": Une exégèse (Tafsir) théologique claire, concise et profonde de ce verset, s'appuyant sur les commentaires classiques (Ibn Kathir, Al-Jalalayn) ou spirituels. Expliquez le contexte de révélation (Asbab al-Nuzul) si applicable, et la signification profonde des mots.
2. "secrets": Les secrets spirituels ("Asrar") et bienfaits du verset dans la tradition ésotérique islamique. Quelles sont les bénédictions liées à sa récitation (ex: protection, sérénité, ouverture spirituelle, subsistance, soulagement) ? Citez les traditions ou enseignements spirituels correspondants.
3. "actionable": Un tableau de 3 à 4 points concrets montrant comment un croyant peut appliquer ce verset ou s'en inspirer dans sa vie spirituelle et quotidienne moderne.
4. "dua": Une invocation (Doua) inspirée ou liée à ce verset. Écrivez le texte de l'invocation en arabe original (script arabe), suivi directement de sa traduction en ${langName}, sans aucune translittération phonétique en caractères latins.

Format de réponse attendu : Un objet JSON valide respectant cette structure exacte. Ne mettez aucun texte d'enrobage avant ou après le JSON.
`;

      const response = await generateWithRetry(ai, {
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              exegesis: { type: "STRING", description: "Detailed exegesis of the verse" },
              secrets: { type: "STRING", description: "Esoteric and spiritual benefits/blessings (Asrar) of the verse" },
              actionable: {
                type: "ARRAY",
                items: { type: "STRING" },
                description: "3-4 actionable practical lessons from the verse"
              },
              dua: { type: "STRING", description: "An associated prayer or invocation with Arabic text and translation" }
            },
            required: ["exegesis", "secrets", "actionable", "dua"]
          }
        }
      });

      const resultText = cleanJsonText(response?.text || "{}");
      const tafsirData = JSON.parse(resultText);
      res.json(tafsirData);
    } catch (error: any) {
      console.warn("Quran Tafsir generation fallback triggered:", error?.message || error);
      res.json({
        exegesis: "Ce noble verset coranique porte une dimension lumineuse de foi et de guidance spirituelle, rappelant la proximité et la bienveillance du Créateur envers Ses serviteurs sincères.",
        secrets: "La récitation méditée de ce verset attire la paix du cœur (Sakina), la protection contre les tourments et l'élévation spirituelle continue.",
        actionable: [
          "Méditer sur la portée spirituelle du verset dans sa prière quotidienne",
          "Répéter le verset avec recueillement pour apaiser l'esprit",
          "Appliquer avec sincérité la sagesse divine dans ses interactions"
        ],
        dua: "اللَّهُمَّ نَوِّرْ قُلُوبَنَا بِالْقُرْآنِ وَاشْرَحْ صُدُورَنَا بِالْإِيمَانِ\n(Seigneur, illumine nos cœurs par le noble Coran et apaise nos poitrines par la foi.)"
      });
    }
  });

  // Dream Interpretation via Inception Labs (mercury-2.5) / Gemini
  app.post("/api/dreams/interpret", async (req, res) => {
    try {
      const { title, content, type, wirdDone, language, scholar } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!hasAvailableAiKey()) {
        return res.status(500).json({ error: "Aucun service d'IA n'est configuré ou actif" });
      }

      const ai = apiKey ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      }) : null;

      // Detect language: prioritize explicit language, or detect from content
      let targetLang = 'French';
      if (language === 'ha') {
        targetLang = 'Hausa (avec termes spirituels classiques arabes)';
      } else if (language === 'en') {
        // Only if content is predominantly English
        const isFrenchText = /[éàèêëîïôûùüÿçœæ]/i.test(content || '') || /rêvé|songe|nuit|dormi|chien|eau|ciel|peur/i.test(content || '');
        targetLang = isFrenchText ? 'French' : 'English';
      } else {
        targetLang = 'French';
      }

      // Build scholar guidance
      let scholarFocus = "";
      if (scholar === 'ibn_sirin') {
        scholarFocus = `
Spécialisation demandée : **L'Imam Muhammad Ibn Sīrīn (الإمام محمد بن سيرين)**.
Vous devez structurer votre réponse selon les principes de son ouvrage « Muntakhab al-Kalām fī Tafsīr al-Aḥlām » :
- La science des symboles tirés du Coran et des Hadiths.
- L'analyse de l'état moral et spirituel du rêveur.
- La différenciation entre avertissement salutaire et bonne annonce (Bushrā).

STRUCTURE STRICTE EN MARKDOWN (Titres H3 avec Emojis) :
### 1. 🌙 Classification selon la Sunnah Prophétique
- Déterminez la catégorie : **Rū'yā Raḥmāniyya**, **Ḥulm Nafsānī** ou **Ḥulm Shayṭānī**.

### 2. 📜 Les Symboles selon Ibn Sīrīn (ابن سيرين)
- Décryptage minutieux de chaque élément du rêve selon les analogies coraniques.

### 3. 📖 Fondements & Hadiths de Référence
- Les citations et précédents classiques rapportés d'Ibn Sīrīn sur ces symboles.

### 4. 🧭 Signification Personnalisée & Avertissements
- Ce que le rêve enseigne sur les intentions, les fréquentations et les épreuves.

### 5. 🤲 Recommandations & Invocations de Clôture
- Conduite spirituelle (Sadaqa, Zikr, discrétion) et Doua adaptée.
`;
      } else if (scholar === 'nabulusi') {
        scholarFocus = `
Spécialisation demandée : **Sheikh 'Abdul-Ghanī Al-Nābulusī (الشيخ عبد الغني النابلسي)**.
Vous devez structurer votre réponse selon son encyclopédie majeure « Ta'ṭīr al-Anām fī Ta'bīr al-Manām » :
- Dictionnaire symbolique étendu et nuances psychologico-spirituelles.
- Déclinaison matérielle (biens, santé, réputation, entourage) vs spirituelle (foi, cœur, au-delà).
- Présages concrets et avertissements bienveillants.

STRUCTURE STRICTE EN MARKDOWN (Titres H3 avec Emojis) :
### 1. 🌙 Nature & Contexte Onirique (Sunnah)
- Catégorie de vision et pureté de l'état onirique.

### 2. 🕊️ Dictionnaire des Symboles d'Al-Nābulusī (تعطير الأنام)
- Analyse approfondie de chaque symbole selon l'encyclopédie d'Al-Nābulusī.

### 3. ⚖️ Dimensions Matérielles vs Spirituelles
- Portée temporelle (subsistance, famille, épreuves) et résonance pour la foi.

### 4. 🧭 Présages, Réjouissances et Mises en Garde
- Ce qui est annoncé ou ce contre quoi le serviteur doit être vigilant.

### 5. 🤲 Conseils d'Al-Nābulusī & Zikr Recommandé
- Prescriptions spirituelles et invocations apaisantes.
`;
      } else if (scholar === 'ibn_shahin') {
        scholarFocus = `
Spécialisation demandée : **L'Imam Ibn Shāhīn Al-Ẓāhirī (الإمام ابن شاهين الظاهري)**.
Vous devez structurer votre réponse selon son traité « Al-Ishārāt fī 'Ilm al-'Ibārāt » :
- Analyse selon le rang, la piété, la sincérité et la condition sociale du rêveur.
- La grille des intentions cachées et des retournements de situation.
- Les signes de secours divin face aux épreuves.

STRUCTURE STRICTE EN MARKDOWN (Titres H3 avec Emojis) :
### 1. 🌙 Diagnostic Onirique selon la Sunnah
- Nature du songe et degré de véracité selon les conditions de pureté.

### 2. ⚔️ Grille des Situations selon Ibn Shāhīn (الإشارات)
- Lecture des symboles selon que le rêveur est en recherche, en épreuve ou dans l'aisance.

### 3. 🔍 Analyse selon la Piété & l'Entourage
- Influences des relations, des affaires courantes et de la vigilance spirituelle.

### 4. 🧭 Portée pour la Subsistance & le Devenir
- Débouchés, victoires sur les difficultés ou nécessités de rectification.

### 5. 🤲 Conduite Recommandée & Protection Spirituelle
- Actes d'apaisement, prière sur le Prophète et aumône protectrice.
`;
      } else if (scholar === 'jafar_sadiq') {
        scholarFocus = `
Spécialisation demandée : **L'Imam Ja'far Al-Ṣādiq (الإمام جعفر الصادق)**.
Vous devez structurer votre réponse selon la tradition renommée de ses facettes (Auwjuh / Wujūh) :
- Décomposition de chaque symbole majeur en 4 à 8 facettes explicites et distinctes.
- Dimensions secrètes (Bāṭin) et manifestes (Ẓāhir).
- Élévation spirituelle, subsistance, épreuve et délivrance.

STRUCTURE STRICTE EN MARKDOWN (Titres H3 avec Emojis) :
### 1. 🌙 Classification & Clarté de la Vision (Sunnah)
- Nature de la vision et harmonie avec le monde spirituel.

### 2. 🌟 Les Facettes Symboliques de l'Imam Ja'far Al-Ṣādiq (أوجه الرؤيا)
- Décomposez les symboles en facettes numérotées explicites (ex: 1. Élévation, 2. Ennemi démasqué, 3. Subsistance pure, 4. Épreuve passagère).

### 3. 💎 Décomposition Spirituelle & Secrète des Symboles
- Enseignement profond sur la purification du cœur et les mystères voilés.

### 4. 🕊️ Répercussions Terrestres & Célestes
- Ce qui se reflète dans la vie quotidienne et dans la proximité avec le Divin.

### 5. 🤲 Invocations de Lumière & Clôture Spirituelle
- Douas traditionnelles et Zikr de délivrance.
`;
      } else {
        // Complete multi-scholar synthesis
        scholarFocus = `
Spécialisation demandée : **Synthèse Complète des 4 Grands Maîtres Classiques**.
Vous devez couvrir de façon complète et riche les 4 savants :
1. **L'Imam Muhammad Ibn Sīrīn** (analogies coraniques et symboles majeurs)
2. **L'Imam 'Abdul-Ghanī Al-Nābulusī** (nuances psychologiques et dictionnaire des symboles)
3. **L'Imam Ibn Shāhīn Al-Ẓāhirī** (rang, situation et conditions du croyant)
4. **L'Imam Ja'far Al-Ṣādiq** (décomposition en facettes explicites)

STRUCTURE STRICTE EN MARKDOWN (Titres H3 obligatoires avec Emojis) :
### 1. 🌙 Classification & Nature Onirique (Sunnah)
- Déterminez la nature du rêve : **Rū'yā Raḥmāniyya** (Vision divine véridique), **Ḥulm Nafsānī** (Reflet psychologique intérieur), ou **Ḥulm Shayṭānī** (Cauchemar perturbateur à rejeter).
- Rôle du Zikr/Wird prélude : analyse de son impact spirituel.

### 2. 📜 Décryptage Symbolique selon Ibn Sīrīn (الإمام ابن سيرين)
- Analysez chaque symbole clé avec ses analogies coraniques et hadiths authentiques.

### 3. 🕊️ Éclairage d'Al-Nābulusī (الشيخ عبد الغني النابلسي)
- Nuances de *Ta'ṭīr al-Anām* : dimensions matérielles (entourage, biens, santé) vs spirituelles (foi, cœur).

### 4. ⚔️ Analyse d'Ibn Shāhīn Al-Ẓāhirī (الإمام ابن شاهين)
- Portée selon la condition du rêveur : avertissement, épreuve ou soulagement imminent.

### 5. 🌟 Facettes & Aspects selon l'Imam Ja'far Al-Ṣādiq (الإمام جعفر الصادق)
- Décomposez les symboles fondamentaux en 4 à 6 facettes concrètes et spirituelles.

### 6. 🤲 Recommandations Spirituelles & Invocations de Protection (Ādāb al-Ru'yā)
- Conduite prophétique concrète (aumône, discrétion, gratitude ou demande de refuge).
- Doua en arabe avec translittération et traduction française, accompagnée d'un Zikr adapté.
`;
      }

      const prompt = `
Vous êtes un maître érudit en herméneutique onirique islamique (Tafsīr al-Aḥlām / Ta'bīr al-Ru'yā), expert reconnu des sources et ouvrages classiques de référence.

Récit du rêve transmis par le croyant :
- **Titre / Sujet principal** : ${title || "Sans titre spécifique"}
- **Récit détaillé** : ${content}
- **Nature supposée** : ${type || "Non défini"}
- **Prélude spirituel / Zikr avant le sommeil** : ${wirdDone || "Aucun spécifié"}

${scholarFocus}

RÈGLES IMPÉRATIVES DE RÉDACTION :
1. Rédigez l'intégralité de la réponse dans la langue : **${targetLang}**. Si la langue est French, vous DEVEZ rédiger en français élégant, respectueux et chaleureux. Ne répondez JAMAIS en anglais si le rêve est en français.
2. Structurez OBLIGATOIREMENT avec les titres Markdown **### [Numéro]. [Emoji] [Titre de section]**.
3. Chaque titre H3 doit être suivi de paragraphes aérés et de listes à puces avec des termes en gras (**terme**).
4. Insérez des émojis pertinents (🌙, 📜, 🕊️, ⚔️, 🌟, 🤲, 💡, 🛡️) pour une lecture claire, agréable et inspirante.
5. Respectez l'éthique de la Sunnah : ne prétendez jamais prédire l'avenir ou révéler l'Inconnaissable (Al-Ghayb).
6. Concluez TOUJOURS par : **"Wa Allāhu A'lam (والله أعلم - Et Allah sait mieux)"**.
`;

      const response = await generateWithRetry(ai, {
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      let rawText = response.text || "";
      // Ensure H3 titles with emojis and clean markdown structure
      rawText = rawText.replace(/^##\s+/gm, '### ');
      rawText = rawText.replace(/^(?:\*\*)?([1-9])[\.\)]\s*(?:\*\*)?\s*(.+?)(?:\*\*)?:?\s*$/gm, (match, num, title) => {
        if (match.startsWith('###')) return match;
        const cleanTitle = title.replace(/\*\*/g, '').trim();
        let emoji = '✨';
        if (/classification|nature|sunnah|ru'ya|vision/i.test(cleanTitle)) emoji = '🌙';
        else if (/symbole|sirin|analog/i.test(cleanTitle)) emoji = '📜';
        else if (/nabulusi|matiere|spirituel|sens/i.test(cleanTitle)) emoji = '🕊️';
        else if (/shahin|situation|epreuve|piege|combat/i.test(cleanTitle)) emoji = '⚔️';
        else if (/jafar|sadiq|facette|aspect|dimension/i.test(cleanTitle)) emoji = '🌟';
        else if (/recommandation|conseil|invocation|doua|zikr|priere/i.test(cleanTitle)) emoji = '🤲';
        else if (/signification|diagnostic|avertissement/i.test(cleanTitle)) emoji = '🧭';
        const hasEmoji = /[\u{1F300}-\u{1F9FF}]/u.test(cleanTitle);
        return `\n\n### ${num}. ${hasEmoji ? '' : emoji + ' '}${cleanTitle}\n`;
      });

      res.json({ interpretation: rawText.trim() });
    } catch (error: any) {
      console.warn("Dream interpretation fallback triggered:", error?.message || error);
      res.json({
        interpretation: `### 1. 🌙 Classification & Nature Onirique (Sunnah)
Votre récit onirique a bien été reçu et accueilli avec bienveillance spirituelle. Selon les règles prophétiques du **Ta'bīr**, les visions nocturnes sincères sont des signes invitant au recentrage intérieur et à la confiance absolue en la providence d'Allah.

### 2. 📜 Éclairage selon Ibn Sīrīn (الإمام ابن سيرين)
- Les symboles perçus indiquent une phase propice à la clarification des intentions et à la vigilance spirituelle.
- Les analogies classiques associent ce type de vision à la nécessité d'assainir ses relations et de fortifier son bouclier spirituel.

### 3. 🕊️ Nuances d'Al-Nābulusī (الشيخ عبد الغني النابلسي)
- Sur le plan matériel, ce songe invite à préserver sa sérénité face aux bruits du monde extérieur.
- Sur le plan spirituel, il symbolise un appel au renouvellement du pacte de foi et à l'élévation par le recueillement.

### 4. 🌟 Facettes selon l'Imam Ja'far Al-Ṣādiq (الإمام جعفر الصادق)
Les maîtres associent à cette vision 4 facettes fondamentales :
1. **Épreuve passagère** qui purifie l'âme.
2. **Protection divine** face à des hostilités voilées.
3. **Appel à la vigilance** dans la gestion de ses projets.
4. **Délivrance et paix** obtenues par la constance dans le Zikr.

### 5. 🤲 Recommandations Spirituelles & Doua
- **Aumône (Sadaqa)** : Donnez une modeste aumône pour sceller la protection divine.
- **Zikr d'apaisement** : Récitez 129 fois le Nom Divin **Yā Laṭīf (يا لطيف)** et 100 fois la prière sur le Prophète ﷺ.
- **Invocation protectrice** : *« A'ūdhu bi kalimātillāhi-t-tāmmāti min ghaḍabihi wa 'iqābihi wa sharri 'ibādih »* (Je cherche refuge auprès des paroles parfaites d'Allah contre Sa colère, Son châtiment et le mal de Ses créatures).

*Wa Allāhu A'lam (والله أعلم - Et Allah sait mieux).*`
      });
    }
  });

  // AI-Powered Personalized Guidance (L'Asrar Génératif)
  app.post("/api/gemini/asrar-conseil", async (req, res) => {
    try {
      const { task, hijriDay, hijriMonth, hijriYear, moonPhase, eventTitle } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!hasAvailableAiKey()) {
        return res.status(500).json({ error: "Aucun service d'IA n'est configuré ou actif" });
      }

      const ai = apiKey ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      }) : null;

      const prompt = `
Vous êtes un sage spirituel de grande sagesse ("Asrar"), un guide d'orientation comportementale et de préparation mentale.
L'utilisateur sollicite votre conseil de posture mentale et de préparation spirituelle personnalisé pour une tâche professionnelle ou personnelle importante qu'il doit accomplir aujourd'hui.

Contexte temporel, traditionnel et cosmique du jour :
- Tâche à accomplir : "${task}"
- Date de l'agenda traditionnel : ${hijriDay} ${hijriMonth} ${hijriYear} AH
- Phase de la Lune : "${moonPhase || "Non spécifiée"}"
- Événement ou influence spirituelle de ce jour de l'année : "${eventTitle || "Aucun événement particulier"}"

Tâche :
Générez une orientation spirituelle, philosophique, bienveillante et inspirante, et un conseil de préparation mentale unique pour cette journée en français.
Le conseil doit lier subtilement la nature du défi/projet avec la lune ou le jour spirituel traditionnel pour en extraire une recommandation de sagesse ou de posture (ex: focus intérieur, courage bienveillant, silence attentif).

Renvoyez STRICTEMENT un objet JSON valide contenant les champs suivants :
1. "guidance": Un conseil spirituel de 3-4 phrases en français, rédigé avec élégance poétique et profondeur, pour guider la posture mentale de l'utilisateur.
2. "focusKeyword": Un mot-clé de focus spirituel unique pour la journée (ex: "Clarté", "Discernement", "Audace douce", "Silence", "Résilience", "Alignement céleste").
3. "spiritualPractice": Une pratique concrète et discrète recommandée pour cette journée (ex: "Récitation intérieure de 33 fois 'Ya Latif' avant d'entrer en réunion", "S'accorder 5 minutes de silence absolu avant de parler", "Une marche consciente d'ancrage").

Ne mettez aucun texte d'enrobage avant ou après le JSON.
      `;

      const response = await generateWithRetry(ai, {
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              guidance: { type: "STRING", description: "Personalized spiritual and mental guidance" },
              focusKeyword: { type: "STRING", description: "One or two words representing the core focus" },
              spiritualPractice: { type: "STRING", description: "A simple, concrete recommendation/practice" }
            },
            required: ["guidance", "focusKeyword", "spiritualPractice"]
          }
        }
      });

      const resultText = cleanJsonText(response?.text || "{}");
      res.json(JSON.parse(resultText));
    } catch (error: any) {
      console.warn("Asrar Conseil fallback triggered:", error?.message || error);
      res.json({
        guidance: "Abordez votre défi de ce jour par une respiration lente et un calme intérieur. Les transits du jour vous conseillent d'allier patience stratégique et action mesurée, sans hâter les fruits du destin.",
        focusKeyword: "Alignement",
        spiritualPractice: "Prenez 3 minutes de silence conscient avant de démarrer, accompagnées de la récitation intérieure de 'Ya Latif' (129 fois)."
      });
    }
  });

  // Za'irja AI Oracle & Prophetic Poetry
  app.post("/api/zairja/oracle", async (req, res) => {
    try {
      const { 
        question, 
        abjadSum, 
        language, 
        birthDate, 
        birthTime, 
        ascendant, 
        location, 
        elementDominance, 
        qutbDegree 
      } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!hasAvailableAiKey()) {
        return res.status(500).json({ error: "Aucun service d'IA n'est configuré ou actif" });
      }

      const ai = apiKey ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      }) : null;

      const langInstruction = language === 'en' 
        ? "Respond with English translation and interpretation."
        : language === 'ha'
        ? "Respond with Hausa translation and interpretation."
        : "Répondez avec traduction et interprétation en français.";

      const prompt = `
Vous êtes le maître gardien et grand arithmologue de la Za'irja traditionnelle (الزايرجة السبتية الفلكية d'Al-Sabti, Tlemsani & Ibn Khaldoun), la matrice ésotérique combinant l'astrologie sacrée, les degrés des buruj, l'astrolabe céleste et l'Ilm al-Huruf (science des lettres et des nombres).

DONNÉES DU CONSULTANT :
- Question / Niyyah : "${question}"
- Somme Jummal de la question : ${abjadSum || 129}
${birthDate ? `- Date de naissance / consultation : ${birthDate}` : ''}
${birthTime ? `- Heure de naissance / consultation : ${birthTime}` : ''}
${ascendant ? `- Ascendant céleste (Tali' / الطالع) : ${ascendant}` : ''}
${location ? `- Coordonnées / Ville : ${location}` : ''}
${elementDominance ? `- Élément dominant (Feu/Terre/Air/Eau) : ${elementDominance}` : ''}
${qutbDegree ? `- Degré du Pôle (Qutb) : ${qutbDegree}°` : ''}

INSTRUCTIONS DE SORTIE :
1. "arabicVerse": Un poème sacré ou verset rimé (Bayt / Qasida) de 2 à 4 vers en calligraphie arabe avec tashkeel complet (voyelles exactes) répondant mystiquement à la question posée.
2. "translation": La traduction élégante, poétique et rythmée du poème dans la langue demandée (${langInstruction}).
3. "interpretation": Une exégèse spirituelle profonde (Sharh al-Zairja) de 3 à 5 phrases expliquant les causes subtiles, le sens de l'épreuve ou de l'opportunité, et l'orientation juste.
4. "astrologicalDiagnosis": Une analyse synthétique des correspondances astro-spirituelles (rôle de l'ascendant, élément dominant et degré céleste dans cette affaire).
5. "recommendedDhikr": Le Nom Divin ou verset spécifique d'activation avec son nombre exact de récitation Jummal (ex: "يا فتاح يا رزاق (489 fois)").
6. "spiritualPrescription": Une recommandation d'action spirituelle concrète (moment propice, aumône/sadaqa recommandée ou attitude intérieure à adopter).
7. "numericString": Une suite chiffrée sacrée de 5 à 7 nombres séparés par des tirets représentant la corde numérique de la Za'irja (Al-Watar al-Raqami).

Format JSON strict sans balises extérieures.
`;

      const response = await generateWithRetry(ai, {
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              arabicVerse: { type: "STRING", description: "Rhyming Arabic poem with full vocalization (tashkeel)" },
              translation: { type: "STRING", description: "Poetic translation of the verse" },
              interpretation: { type: "STRING", description: "Deep spiritual interpretation and exegesis" },
              astrologicalDiagnosis: { type: "STRING", description: "Astrological and celestial synthesis" },
              recommendedDhikr: { type: "STRING", description: "Recommended divine name with exact numerical count" },
              spiritualPrescription: { type: "STRING", description: "Prescription including auspicious time, sadaqa or remedy" },
              numericString: { type: "STRING", description: "Extracted numeric string cord" }
            },
            required: ["arabicVerse", "translation", "interpretation", "astrologicalDiagnosis", "recommendedDhikr", "spiritualPrescription", "numericString"]
          }
        }
      });

      const resultText = cleanJsonText(response?.text || "{}");
      res.json(JSON.parse(resultText));
    } catch (error: any) {
      console.error("Zairja Oracle generation error:", error);
      res.status(500).json({ error: "Failed to generate Zairja Oracle" });
    }
  });

  // AI Search Assistant
  app.post("/api/assistant/search", async (req, res) => {
    try {
      const { query, availableItems } = req.body; // availableItems could be a summarized list [{id, title, category}]
      const apiKey = process.env.GEMINI_API_KEY;
      if (!hasAvailableAiKey()) {
        return res.status(500).json({ error: "Aucun service d'IA n'est configuré ou actif" });
      }

      const ai = apiKey ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      }) : null;
      const prompt = `
Vous êtes un assistant spirituel islamique.
L'utilisateur pose la question suivante : "${query}"

Voici la liste des éléments disponibles dans notre base de données :
${JSON.stringify(availableItems)}

Tâche :
1. Analysez la question de l'utilisateur.
2. Suggérez les meilleurs éléments de la liste fournie qui répondent à son besoin (ex: recettes d'ouverture, versets contre le mauvais œil, etc.).
3. Répondez avec un court message d'encouragement/conseil (max 2-3 phrases) suivi UNIQUEMENT d'un tableau JSON contenant les IDs recommandés, sous ce format EXACT :
---MESSAGE---
Votre message ici...
---IDS---
["id1", "id2"]
`;

      const response = await generateWithRetry(ai, {
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      const text = response?.text || "";
      const messagePart = text.split("---IDS---")[0]?.replace("---MESSAGE---", "")?.trim() || "Voici quelques recommandations :";
      let idsPart = text.split("---IDS---")[1]?.trim() || "[]";
      
      // try to parse JSON
      let recommendedIds = [];
      try {
        // find array in text if any
        const match = idsPart.match(/\[.*\]/s);
        if (match) {
          recommendedIds = JSON.parse(match[0]);
        }
      } catch (e) {
        console.error("Failed to parse JSON ids from AI");
      }

      res.json({ message: messagePart, recommendedIds });
    } catch (error: any) {
      console.error("AI Search error:", error);
      res.status(500).json({ error: "Failed to generate search results" });
    }
  });

  // AI FAQ Assistant
  app.post("/api/assistant/faq", async (req, res) => {
    try {
      const { question, language } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!hasAvailableAiKey()) {
        return res.status(500).json({ error: "Aucun service d'IA n'est configuré ou actif" });
      }

      const ai = apiKey ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      }) : null;
      const prompt = `
Vous êtes un expert spirituel islamique et un guide bienveillant sur l'application AsrarHub.
L'utilisateur pose la question suivante : "${question}"
La langue de l'utilisateur est : "${language || 'fr'}" (traduisez la réponse finale dans cette langue).

Règles de comportement et formatage (TRÈS IMPORTANT) :
1. **Professionnalisme et Empathie** : Répondez de manière très professionnelle, détaillée, bien structurée, claire, concise et apaisante. Ne soyez jamais familier.
2. **Formatage Markdown** : Utilisez correctement le Markdown.
3. **Titres avec Emojis** : TOUS vos titres (de H1 à H6, ex: #, ##, ###) doivent être bien stylisés et TOUJOURS accompagnés d'un emoji approprié (ex: "## 🌟 L'importance du Tawakkul").
4. **Textes Sacrés** : Lorsque vous citez des Sourates, Versets Coraniques ou des Douas (invocations), VOUS DEVEZ OBLIGATOIREMENT les écrire d'abord en Arabe (avec le texte original), puis fournir la traduction juste en dessous dans la langue choisie par l'utilisateur (${language || 'fr'}).
5. **Précision** : Utilisez la terminologie islamique appropriée (wird, zikr, baraka, etc.).
6. **Limites** : Restez dans le contexte de la spiritualité, des prières et des invocations. Ne pas inventer de verdicts religieux (fatwa).
`;

      const response = await generateWithRetry(ai, {
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      res.json({ answer: response?.text || "Une erreur s'est produite lors de la génération de la réponse." });
    } catch (error: any) {
      console.error("AI FAQ error:", error);
      const isOverloaded = error?.status === 503 || error?.message?.includes("503");
      res.status(isOverloaded ? 503 : 500).json({ error: "Failed to generate answer" });
    }
  });

  // AI-Powered Cross-Tool Spiritual Convergence & Rapprochements
  app.post("/api/gemini/spiritual-rapprochements", async (req, res) => {
    try {
      const { userName, nameAbjad, dreamContent, currentPlanet, currentMansion } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!hasAvailableAiKey()) {
        return res.status(500).json({ error: "Aucun service d'IA n'est configuré ou actif" });
      }

      const ai = apiKey ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      }) : null;

      const prompt = `
Vous êtes l'Assistant Métaphysique Suprême d'AsrarHub, un maître spirituel spécialisé dans le croisement multidimensionnel ("Rapprochements Esotériques").
Votre rôle est d'analyser les données convergentes d'un utilisateur pour lui révéler les secrets cachés reliant son identité, ses rêves et le climat céleste actuel.

Voici les données d'entrée de l'utilisateur :
- Nom de l'utilisateur : "${userName || "Inconnu"}"
- Poids mystique (Abjad) de son nom : ${nameAbjad || "Non calculé"}
- Rêve ou vision récent : "${dreamContent || "Aucun rêve saisi"}"
- Planète dominante actuelle : "${currentPlanet || "Lune"}"
- Demeure de la Lune (Mansion) actuelle : "${currentMansion || "Al-Sharatain"}"

Tâche :
Générez une synthèse ésotérique profonde, unifiée, réconfortante et extrêmement inspirante en français.
Votre analyse doit lier le symbolisme du rêve au poids numérique (Abjad) de l'utilisateur et aux énergies planétaires et lunaires de l'instant présent.

RÈGLES CRUCIALES DE TRADUCTION ET GÉNÉRATION (SANS TRANSLITTÉRATION) :
1. PAS DE TRANSLITTÉRATION : Ne générez JAMAIS de translittération phonétique latine pour les invocations ou les mots arabes.
2. ARABE ORIGINAL : Écrivez TOUJOURS les wirds, les versets et les noms d'Allah directement en alphabet arabe original.
3. TRADUCTION DIRECTE : Fournissez une traduction claire, fluide et entièrement en Français juste en dessous de chaque texte arabe.

Renvoyez STRICTEMENT un objet JSON valide contenant les champs suivants :
1. "synthesis": Une synthèse d'analyse (3-4 paragraphes riches en français) reliant le rêve, le nom (son Abjad) et l'alignement céleste actuel. Expliquez comment la vibration de son nom résonne avec le rêve reçu sous cette influence astrale.
2. "focusName": Un attribut d'énergie divine (un des Noms d'Allah) qui vibre le plus fort avec cette convergence, écrit en Arabe original suivi directement de sa traduction.
3. "zikrRecommendation": Une recommandation de Wird/Zikr personnalisée pour l'utilisateur. Exemple : "Réciter Ya Latif (يَا لَطِيفُ) 129 fois après la prière d'Al-Asr."
4. "targetCount": Le nombre exact de récitations recommandé (type nombre entier).
5. "recommendedArabic": Le texte arabe du zikr à réciter (uniquement en alphabet arabe original).
6. "recommendedNameOnly": Le nom en français/translittération du zikr pour le bouton (ex: "Ya Latif").
7. "spiritualBenefit": Les bienfaits spirituels uniques de cette pratique synchronisée pour l'utilisateur en ce moment précis.

Format de réponse attendu : Un objet JSON valide respectant cette structure exacte. Ne mettez aucun texte d'enrobage avant ou après le JSON.
      `;

      const response = await generateWithRetry(ai, {
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              synthesis: { type: "STRING" },
              focusName: { type: "STRING" },
              zikrRecommendation: { type: "STRING" },
              targetCount: { type: "INTEGER" },
              recommendedArabic: { type: "STRING" },
              recommendedNameOnly: { type: "STRING" },
              spiritualBenefit: { type: "STRING" }
            },
            required: ["synthesis", "focusName", "zikrRecommendation", "targetCount", "recommendedArabic", "recommendedNameOnly", "spiritualBenefit"]
          }
        }
      });

      const resultText = cleanJsonText(response?.text || "{}");
      res.json(JSON.parse(resultText));
    } catch (error: any) {
      console.error("Spiritual Rapprochements generation error:", error);
      res.status(500).json({ error: "Failed to generate metaphysical rapprochment" });
    }
  });

  // AI Article Translation
  app.post("/api/translate-article", async (req, res) => {
    try {
      const { title, content, hook, benefits, targetLanguage } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!hasAvailableAiKey()) {
        return res.status(500).json({ error: "Aucun service d'IA n'est configuré ou actif" });
      }

      if (!targetLanguage || (targetLanguage !== 'en' && targetLanguage !== 'ha')) {
        return res.status(400).json({ error: "Invalid target language. Supported: 'en', 'ha'" });
      }

      // Check server cache first
      const cacheKey = `art_${targetLanguage}_${(title || '').slice(0, 50)}_${(content || '').slice(0, 50)}`;
      const cached = getCachedTranslation(cacheKey);
      if (cached) {
        return res.json(cached);
      }

      const ai = apiKey ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      }) : null;

      const languageName = targetLanguage === 'ha' ? 'Hausa' : 'English';

      // Extract and safely shield all media tags (<audio...>, <video...>, <iframe...>, <img...>) from being stripped
      const mediaMap = new Map<string, string>();
      let sanitizedContent = content || "";
      let mediaIndex = 0;

      const mediaRegex = /<(audio|video|iframe)[^>]*>[\s\S]*?<\/\1>|<(audio|video|iframe|img)[^>]*\/?>/gi;
      sanitizedContent = sanitizedContent.replace(mediaRegex, (match) => {
        const placeholder = `___MEDIA_EMBED_TAG_${mediaIndex}___`;
        mediaMap.set(placeholder, match);
        mediaIndex++;
        return placeholder;
      });
      
      const prompt = `
You are an expert translator specializing in spiritual, Islamic, and esoteric literature.
Your task is to translate ALL the text fields of the provided article from French into ${languageName} (language code: "${targetLanguage}").

Strict translation mandates:
1. ARABIC TEXT: Do NOT translate, modify, or romanize any Arabic script, Quranic verses, or Names of Allah written in Arabic. Keep them exactly as they are.
2. TRANSLATE EVERYTHING ELSE: Every single French word, phrase, and sentence in the title, hook, content, and benefits MUST be translated into elegant, professional ${languageName}.
3. NO TRANSLITERATION: You MUST NOT generate or use Latin/Roman transliterations of Arabic words or verses (e.g., do not write Arabic words like 'Bismillah', 'Alhamdulillah', or entire Quranic verses using the Latin alphabet).
4. COMPLETE CONTENT BODY: You MUST translate the ENTIRE "content" body. Do NOT summarize it, do NOT leave any sections in French, and do NOT skip any paragraphs.
5. HTML & MEDIA PLACEHOLDERS PRESERVATION: The "content" body contains HTML tags (<p>, <strong>, <br>, <li>, <ul>, etc.) and media tokens (like ___MEDIA_EMBED_TAG_0___). You MUST keep all HTML tags and exact media tokens in their original relative positions!
6. PROTECTED WORDS (CRITICAL): The words "arabe", "verset", "douas" (or "doua") MUST remain completely intact and untranslated (do not translate "arabe" to "Arabic" or "verset" to "verse" or "douas" to "prayers"/"supplications"). Keep these specific terms exactly as "arabe", "verset", "doua" or "douas" in the final output.
7. JSON OUTPUT: Your output must match the requested JSON schema.

Input Article to Translate:
---
Title: ${title || ""}
---
Hook: ${hook || ""}
---
Content (Body to translate while preserving HTML tags and media tokens): 
${sanitizedContent}
---
Benefits: ${JSON.stringify(benefits || [])}
---
`;

      const response = await generateWithRetry(ai, {
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              title: { type: "STRING", description: "The translated title" },
              hook: { type: "STRING", description: "The translated hook" },
              content: { type: "STRING", description: "The translated content keeping all HTML tags and media tokens" },
              benefits: {
                type: "ARRAY",
                items: { type: "STRING" },
                description: "The translated list of benefits"
              }
            },
            required: ["title", "hook", "content", "benefits"]
          }
        }
      });

      const resultText = cleanJsonText(response?.text || "{}");
      const translatedData = JSON.parse(resultText);

      // Restore all preserved media tags into translated content
      let finalTranslatedContent = translatedData.content || "";
      mediaMap.forEach((originalTag, placeholder) => {
        finalTranslatedContent = finalTranslatedContent.split(placeholder).join(originalTag);
      });
      // Fallback safeguard: if model omitted any media placeholder, re-append the missing media tag
      mediaMap.forEach((originalTag, placeholder) => {
        if (!finalTranslatedContent.includes(originalTag)) {
          finalTranslatedContent += `\n${originalTag}`;
        }
      });
      translatedData.content = finalTranslatedContent;

      setCachedTranslation(cacheKey, translatedData);
      res.json(translatedData);
    } catch (error: any) {
      console.warn("AI Article Translation error (using fallback):", error?.message || error);
      // Graceful fallback to original content so the UI does not break
      const fallbackData = {
        title: req.body?.title || "",
        hook: req.body?.hook || "",
        content: req.body?.content || "",
        benefits: req.body?.benefits || []
      };
      res.json(fallbackData);
    }
  });

  // AI Generic Text Translation
  app.post("/api/translate-text", async (req, res) => {
    try {
      const { texts, targetLanguage } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!hasAvailableAiKey()) {
        return res.status(500).json({ error: "Aucun service d'IA n'est configuré ou actif" });
      }

      if (!targetLanguage || (targetLanguage !== 'en' && targetLanguage !== 'ha')) {
        return res.status(400).json({ error: "Invalid target language. Supported: 'en', 'ha'" });
      }

      // Check server cache first
      const cacheKey = `txt_${targetLanguage}_${JSON.stringify(texts || {})}`;
      const cached = getCachedTranslation(cacheKey);
      if (cached) {
        return res.json(cached);
      }

      const ai = apiKey ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      }) : null;

      const languageName = targetLanguage === 'ha' ? 'Hausa' : 'English';
      const textArray = Object.entries(texts || {}).map(([key, value]) => ({ key, value }));
      
      const prompt = `
You are a professional translator specializing in spiritual, Islamic, and esoteric literature.
Translate the following texts from French into ${languageName} (language code: "${targetLanguage}").

Strict Rules:
1. Retain all Arabic text, Quranic verses, and Names of Allah written in Arabic script EXACTLY as they are. Do not translate or alter Arabic script.
2. Translate all French/non-Arabic text into highly professional, elegant ${languageName}.
3. Do NOT translate the words "arabe", "verset", and "douas" (or "doua"). Keep these specific terms completely intact and unchanged (e.g., do not translate "arabe" to "Arabic", "verset" to "verse", or "doua" to "prayer").
4. NO TRANSLITERATION: Do NOT use or produce Latin/Roman transliterations of any Arabic words or Quranic verses (e.g., do not write out Arabic words or verses using the Latin/Roman alphabet). Keep Arabic script as-is, translate French, but never add Latin phonetic transliterations.
5. Keep the keys exactly as they are.

Texts to translate:
${JSON.stringify(textArray)}
`;

      const response = await generateWithRetry(ai, {
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              translations: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    key: { type: "STRING" },
                    value: { type: "STRING" }
                  },
                  required: ["key", "value"]
                }
              }
            },
            required: ["translations"]
          }
        }
      });

      const resultText = cleanJsonText(response?.text || '{"translations":[]}');
      const parsed = JSON.parse(resultText);
      const translatedData: Record<string, string> = {};
      if (parsed.translations && Array.isArray(parsed.translations)) {
        parsed.translations.forEach((item: any) => {
          if (item && item.key) {
            translatedData[item.key] = item.value || '';
          }
        });
      }
      setCachedTranslation(cacheKey, translatedData);
      res.json(translatedData);
    } catch (error: any) {
      console.warn("AI Text Translation error (using original text fallback):", error?.message || error);
      // Graceful fallback mapping each requested key back to original text so client UI never breaks
      const fallbackData: Record<string, string> = {};
      if (req.body?.texts && typeof req.body.texts === 'object') {
        Object.entries(req.body.texts).forEach(([k, v]) => {
          fallbackData[k] = String(v || '');
        });
      }
      res.json(fallbackData);
    }
  });

  // Paystack verification
  app.post("/api/verify-paystack", async (req, res) => {
    try {
      const { reference, userId } = req.body;
      const paystackKey = process.env.PAYSTACK_SECRET_KEY;
      
      if (!paystackKey) {
        throw new Error("Paystack secret key not configured");
      }

      // Verify transaction with Paystack
      const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${paystackKey}`
        }
      });
      const data = await response.json();

      if (data.status && data.data.status === 'success') {
        const db = getDb();
        if (!db) {
          return res.status(500).json({ error: "Firebase Admin is not initialized on server." });
        }
        // Update user to premium
        await db.collection("users").doc(userId).update({
          subscriptionTier: "premium",
          premiumUntil: Timestamp.fromDate(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000))
        });
        res.json({ success: true, message: "Payment verified and user upgraded" });
      } else {
        res.status(400).json({ success: false, message: "Payment verification failed" });
      }
    } catch (error: any) {
      console.error("Paystack verification error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Send Push Notifications via FCM
  app.post("/api/send-push", async (req, res) => {
    try {
      const { tokens, title, body, data } = req.body;
      if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
        return res.status(400).json({ error: "Missing or invalid tokens parameter" });
      }

      if (!getApps().length) {
        return res.status(500).json({ error: "Firebase Admin is not initialized on the server. Please configure FIREBASE_SERVICE_ACCOUNT." });
      }

      const { getMessaging } = await import("firebase-admin/messaging");
      const messaging = getMessaging();

      const response = await messaging.sendEachForMulticast({
        tokens,
        notification: {
          title: title || "Rappel AsrarHub",
          body: body || "C'est l'heure de votre Wird !",
        },
        data: data || {},
      });

      res.json({
        success: true,
        successCount: response.successCount,
        failureCount: response.failureCount,
        responses: response.responses
      });
    } catch (error: any) {
      console.error("FCM Send Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // AI Community Spiritual Guide Chat endpoint
  app.post("/api/community/ai-chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!hasAvailableAiKey()) {
        return res.status(500).json({ error: "Aucun service d'IA n'est configuré ou actif" });
      }

      const ai = apiKey ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      }) : null;

      // Retrieve dynamic real recipes, secrets, and wirds to feed as context for recommending actual app contents
      const availableItems: any[] = [];
      try {
        if (getApps().length) {
          const db = getDb();
          const articlesSnap = await db.collection("articles").limit(35).get();
          articlesSnap.forEach((docSnap) => {
            const data = docSnap.data();
            availableItems.push({ id: docSnap.id, title: data.title || data.title_fr || data.title_en, type: "recette/article" });
          });
          const grandOathsSnap = await db.collection("grand_oaths").limit(35).get();
          grandOathsSnap.forEach((docSnap) => {
            const data = docSnap.data();
            availableItems.push({ id: docSnap.id, title: data.title || data.title_fr || data.title_en || data.arabicTitle, type: "secret/wird/grand_serment" });
          });
          const lexiqueSnap = await db.collection("lexique_terms").limit(35).get();
          lexiqueSnap.forEach((docSnap) => {
            const data = docSnap.data();
            availableItems.push({ id: docSnap.id, title: data.word || data.word_fr || data.word_en, definition: data.definition || data.definition_fr, type: "lexique/reve/definition" });
          });
        }
      } catch (dbErr) {
        console.warn("Could not query Firestore for AI context grounding:", dbErr);
      }

      const prompt = `
Vous êtes "IA Asrar", le Guide Spirituel Virtuel officiel de l'application AsrarHub.
Votre unique mission est d'aider les utilisateurs premium de la communauté d'AsrarHub à comprendre les secrets spirituels coraniques, les wirds de l'application, les secrets et recettes d'AsrarHub, la science des Noms d'Allah, et d'interpréter les rêves selon les saines traditions (comme celle d'Ibn Sirin).

RÈGLES DE PERTINENCE ABSOLUES ET STRICTES :
1. Vous devez UNIQUEMENT répondre aux questions portant sur :
   - Les Noms d'Allah (Asma-ul-Husna), leurs bienfaits, significations et zikr associés.
   - Les rêves et leur interprétation spirituelle (selon la noble tradition islamique comme celle d'Ibn Sirin).
   - Les wirds, zikrs, prières sur le Prophète (Salat al-Fatih, Salat Nariya, etc.) et secrets spirituels coraniques/islamiques.
   - Les recettes spirituelles et secrets de l'application AsrarHub.
   - Les fonctionnalités de l'application AsrarHub elle-même (ex: "comment ajouter un wird ?", "la boussole de Qibla", "le chapelet électronique", "les forums", etc.).
   
2. REFUS DE TOUTES QUESTIONS INUTILES OU HORS-SUJET :
   - Si un utilisateur pose une question qui n'est pas spirituelle ou pas liée à l'un de ces thèmes (ex: "comment coder en Python ?", "recette de gâteau au chocolat", "politique", "sport", "qui est Elon Musk", "aide-moi pour mes devoirs", "bavardages futiles"), vous devez POLIMENT MAIS FERMEMENT REFUSER de répondre.
   - Réponse type en cas de refus : "Que la paix soit sur vous. En tant qu'assistant IA Asrar, ma mission est exclusivement dédiée aux mystères des Noms d'Allah, à l'interprétation des rêves, aux wirds, aux secrets spirituels coraniques et à l'application AsrarHub. Je ne peux malheureusement pas vous aider sur ce sujet profane ou hors-cadre. N'hésitez pas à me poser des questions sur les wirds, secrets coraniques, rêves, ou les Noms divins !"

3. PROPOSITION DE CONTENU RÉEL PRÉSENT DANS L'APPLICATION :
   - Si un utilisateur pose une question sur un wird, un secret, une recette spirituelle ou un concept, vous devez IMPÉRATIVEMENT lui proposer un ou plusieurs éléments réels de l'application si l'un d'eux correspond à sa recherche.
   - Voici la liste en temps réel des éléments réellement configurés et disponibles dans notre base de données AsrarHub :
${JSON.stringify(availableItems)}
   - Citez précisément le titre exact de l'élément recommandé (par exemple "Da'wat al-Birhatiyya" ou "Ya Latif") pour que l'utilisateur puisse le rechercher et l'utiliser directement dans l'application AsrarHub.

4. LANGUE ET TON :
   - Répondez toujours de manière fluide, naturelle et éloquente dans la langue de l'utilisateur (Français, Anglais, ou Haoussa).
   - Le ton doit être sage, extrêmement respectueux, humble, pieux, bienveillant et hautement spirituel.

Détails de la conversation actuelle :
- Message de l'utilisateur : "${message}"
- Historique récent : ${JSON.stringify(history || [])}
`;

      const response = await generateWithRetry(ai, {
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      res.json({ reply: response?.text || "Je n'ai pas pu générer de réponse spirituelle pour le moment." });
    } catch (error: any) {
      console.error("AI Community Chat error:", error);
      res.status(500).json({ error: "Failed to communicate with spiritual assistant" });
    }
  });

  // AI Book Cover Generator endpoint
  app.post("/api/admin/generate-book-cover", async (req, res) => {
    try {
      const { prompt, title, subtitle, author, themeStyle } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      
      let generatedImageUrl: string | null = null;
      let enhancedPrompt = prompt || `Book cover illustration for a book titled "${title || 'Le Livre des Secrets'}", ${themeStyle || 'mystical gold and emerald'}, high quality book cover art`;

      const ai = apiKey ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      }) : null;

      if (apiKey || INCEPTION_API_KEY) {
        // Prompt expansion using Inception Labs (mercury-2.5) / Gemini
        try {
          const promptExpansion = await generateWithRetry(ai, {
            model: "gemini-3.8-flash",
            contents: `System: You are a world-class artistic director specializing in luxury book cover artwork, spiritual manuscripts, and e-book design. Create a detailed visual prompt in English (max 45 words) for an image generator to create a stunning background artwork for:
Title: "${title || 'Les Secrets Spirituels'}"
Subtitle: "${subtitle || ''}"
Theme/Style: ${themeStyle || 'Islamic spiritual manuscript, gold filigree, emerald leather, sacred geometry'}
User Description: ${prompt || 'elegant book cover artwork with gold accents'}
Return ONLY the English visual prompt text.`
          });
          if (promptExpansion?.text) {
            enhancedPrompt = promptExpansion.text.trim();
          }
        } catch (expansionErr) {
          console.warn("Prompt expansion fallback:", expansionErr);
        }

        // Try Imagen 3.0 image generation if GoogleGenAI is available
        if (ai) {
          try {
            const imageRes = await ai.models.generateImages({
              model: "imagen-3.0-generate-002",
              prompt: enhancedPrompt,
              config: {
                numberOfImages: 1,
                outputMimeType: "image/jpeg",
                aspectRatio: "3:4"
              }
            });

            if (imageRes.generatedImages && imageRes.generatedImages[0]?.image?.imageBytes) {
              const base64Bytes = imageRes.generatedImages[0].image.imageBytes;
              generatedImageUrl = `data:image/jpeg;base64,${base64Bytes}`;
            }
          } catch (imgErr: any) {
            console.warn("Imagen generation error (falling back to prompt & client canvas):", imgErr?.message || imgErr);
          }
        }
      }

      res.json({
        success: true,
        imageUrl: generatedImageUrl,
        enhancedPrompt
      });
    } catch (error: any) {
      console.error("Error in /api/admin/generate-book-cover:", error);
      res.status(500).json({ error: error.message || "Failed to process book cover request" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    
    // Dynamically store the backend URL to Firestore settings/features
    try {
      const appUrl = process.env.APP_URL;
      const adminDb = getDb();
      if (appUrl && adminDb) {
        const settingsRef = adminDb.collection("settings").doc("features");
        await settingsRef.set({
          backend_url: appUrl
        }, { merge: true });
        console.log(`Saved dynamic backend_url to Firestore settings/features: ${appUrl}`);
      } else if (appUrl) {
        console.log("APP_URL present, but Firebase Admin not initialized (FIREBASE_SERVICE_ACCOUNT unset). Skipping backend_url save.");
      }
    } catch (e) {
      console.error("Failed to store backend_url on startup:", e);
    }
  });
}

startServer();
