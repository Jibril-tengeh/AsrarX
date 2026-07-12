import "dotenv/config";
import express from "express";
import path from "path";
import cors from "cors";
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
    if (!getApps().length) throw new Error("Firebase Admin not initialized");
    return getFirestore();
  };

  // General body parsing for other endpoints
  app.use(express.json());
  app.use(cors());

  // Helper for retrying Gemini API calls
  const generateWithRetry = async (ai: GoogleGenAI, params: any, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        return await ai.models.generateContent(params);
      } catch (error: any) {
        const isTransient = error?.status === 503 || error?.status === 429 || error?.message?.includes("503") || error?.message?.includes("429");
        if (i === retries - 1 || !isTransient) throw error;
        await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1))); // Exponential-ish backoff
      }
    }
  };

  // Dream Interpretation via Gemini
  app.post("/api/dreams/interpret", async (req, res) => {
    try {
      const { title, content, type, wirdDone } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API key is not configured" });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      const prompt = `
Vous êtes un expert en interprétation islamique des rêves, suivant la méthodologie d'Ibn Sirin et des savants spirituels.
L'utilisateur partage le rêve suivant :
Titre : ${title}
Contenu du rêve : ${content}
Type perçu : ${type}
Wird/Zikr effectué avant de dormir : ${wirdDone || "Aucun"}

Règles d'éthique spirituelle :
- Ne jamais prédire l'avenir de façon absolue (seul Allah sait).
- Toujours utiliser "Allahou A'lam" (Dieu sait mieux).
- Si le rêve semble 'shaytani' (cauchemar), conseiller fermement de chercher refuge auprès d'Allah (A'oudhou billah) et de ne pas le raconter.
- Fournir une interprétation concise, apaisante et ancrée dans le symbolisme classique islamique (Ibn Sirin).
- Répondre en français avec douceur et sagesse spirituelle.
`;

      const response = await generateWithRetry(ai, {
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      res.json({ interpretation: response.text });
    } catch (error: any) {
      console.error("Dream interpretation error:", error);
      res.status(500).json({ error: "Failed to generate interpretation" });
    }
  });

  // AI Search Assistant
  app.post("/api/assistant/search", async (req, res) => {
    try {
      const { query, availableItems } = req.body; // availableItems could be a summarized list [{id, title, category}]
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API key is not configured" });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
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
        model: "gemini-3.5-flash",
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
      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API key is not configured" });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
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
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      res.json({ answer: response?.text || "Une erreur s'est produite lors de la génération de la réponse." });
    } catch (error: any) {
      console.error("AI FAQ error:", error);
      const isOverloaded = error?.status === 503 || error?.message?.includes("503");
      res.status(isOverloaded ? 503 : 500).json({ error: "Failed to generate answer" });
    }
  });

  // AI Article Translation
  app.post("/api/translate-article", async (req, res) => {
    try {
      const { title, content, hook, benefits, targetLanguage } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API key is not configured" });
      }

      if (!targetLanguage || (targetLanguage !== 'en' && targetLanguage !== 'ha')) {
        return res.status(400).json({ error: "Invalid target language. Supported: 'en', 'ha'" });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const languageName = targetLanguage === 'ha' ? 'Hausa' : 'English';
      
      const prompt = `
You are a professional translator specializing in spiritual, Islamic, and esoteric literature.
Translate the following article fields from French into ${languageName} (language code: "${targetLanguage}").

Strict Rules:
1. Retain all Arabic text, Quranic verses, and Names of Allah written in Arabic script EXACTLY as they are. Do not translate or alter Arabic script.
2. Translate all French/non-Arabic text into highly professional, elegant ${languageName}.
3. Preserve all HTML formatting tags (like <p>, <strong>, <br>, <li>, etc.) inside the "content" field exactly as they are.
4. Output the translation in JSON matching the requested schema.

Input Fields:
Title: ${title || ""}
Hook: ${hook || ""}
Content: ${content || ""}
Benefits: ${JSON.stringify(benefits || [])}
`;

      const response = await generateWithRetry(ai, {
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              title: { type: "STRING", description: "The translated title" },
              hook: { type: "STRING", description: "The translated hook" },
              content: { type: "STRING", description: "The translated content keeping all HTML tags" },
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

      const resultText = response?.text?.trim() || "{}";
      const translatedData = JSON.parse(resultText);
      res.json(translatedData);
    } catch (error: any) {
      console.error("AI Article Translation error:", error);
      res.status(500).json({ error: "Failed to translate article" });
    }
  });

  // AI Generic Text Translation
  app.post("/api/translate-text", async (req, res) => {
    try {
      const { texts, targetLanguage } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API key is not configured" });
      }

      if (!targetLanguage || (targetLanguage !== 'en' && targetLanguage !== 'ha')) {
        return res.status(400).json({ error: "Invalid target language. Supported: 'en', 'ha'" });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const languageName = targetLanguage === 'ha' ? 'Hausa' : 'English';
      const textArray = Object.entries(texts || {}).map(([key, value]) => ({ key, value }));
      
      const prompt = `
You are a professional translator specializing in spiritual, Islamic, and esoteric literature.
Translate the following texts from French into ${languageName} (language code: "${targetLanguage}").

Strict Rules:
1. Retain all Arabic text, Quranic verses, and Names of Allah written in Arabic script EXACTLY as they are. Do not translate or alter Arabic script.
2. Translate all French/non-Arabic text into highly professional, elegant ${languageName}.
3. Keep the keys exactly as they are.

Texts to translate:
${JSON.stringify(textArray)}
`;

      const response = await generateWithRetry(ai, {
        model: "gemini-3.5-flash",
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

      const resultText = response?.text?.trim() || '{"translations":[]}';
      const parsed = JSON.parse(resultText);
      const translatedData: Record<string, string> = {};
      if (parsed.translations && Array.isArray(parsed.translations)) {
        parsed.translations.forEach((item: any) => {
          if (item && item.key) {
            translatedData[item.key] = item.value || '';
          }
        });
      }
      res.json(translatedData);
    } catch (error: any) {
      console.error("AI Text Translation error:", error);
      res.status(500).json({ error: "Failed to translate text" });
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
      if (appUrl) {
        const adminDb = getDb();
        const settingsRef = adminDb.collection("settings").doc("features");
        await settingsRef.set({
          backend_url: appUrl
        }, { merge: true });
        console.log(`Saved dynamic backend_url to Firestore settings/features: ${appUrl}`);
      }
    } catch (e) {
      console.error("Failed to store backend_url on startup:", e);
    }
  });
}

startServer();
