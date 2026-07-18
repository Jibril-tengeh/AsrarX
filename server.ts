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

  // AI Quran Tafsir & Spiritual Secrets (Asrar)
  app.post("/api/quran/tafsir", async (req, res) => {
    try {
      const { surahNumber, surahName, ayahNumber, arabicText, translationText, language } = req.body;
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
        model: "gemini-3.5-flash",
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

      const resultText = response?.text?.trim() || "{}";
      const tafsirData = JSON.parse(resultText);
      res.json(tafsirData);
    } catch (error: any) {
      console.error("Quran Tafsir generation error:", error);
      res.status(500).json({ error: "Failed to generate Quranic Tafsir & Secrets" });
    }
  });

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

  // AI-Powered Personalized Guidance (L'Asrar Génératif)
  app.post("/api/gemini/asrar-conseil", async (req, res) => {
    try {
      const { task, hijriDay, hijriMonth, hijriYear, moonPhase, eventTitle } = req.body;
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
        model: "gemini-3.5-flash",
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

      const resultText = response?.text?.trim() || "{}";
      res.json(JSON.parse(resultText));
    } catch (error: any) {
      console.error("Asrar Conseil generation error:", error);
      res.status(500).json({ error: "Failed to generate AI counsel" });
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
You are an expert translator specializing in spiritual, Islamic, and esoteric literature.
Your task is to translate ALL the text fields of the provided article from French into ${languageName} (language code: "${targetLanguage}").

Strict translation mandates:
1. ARABIC TEXT: Do NOT translate, modify, or romanize any Arabic script, Quranic verses, or Names of Allah written in Arabic. Keep them exactly as they are.
2. TRANSLATE EVERYTHING ELSE: Every single French word, phrase, and sentence in the title, hook, content, and benefits MUST be translated into elegant, professional ${languageName}.
3. NO TRANSLITERATION: You MUST NOT generate or use Latin/Roman transliterations of Arabic words or verses (e.g., do not write Arabic words like 'Bismillah', 'Alhamdulillah', or entire Quranic verses using the Latin alphabet).
4. COMPLETE CONTENT BODY: You MUST translate the ENTIRE "content" body. Do NOT summarize it, do NOT leave any sections in French, and do NOT skip any paragraphs.
5. HTML PRESERVATION: The "content" body contains HTML tags (like <p>, <strong>, <br>, <li>, <ul>, etc.). You must keep all these tags exactly in their original positions and structure, while translating the French text inside or between them.
6. PROTECTED WORDS (CRITICAL): The words "arabe", "verset", "douas" (or "doua") MUST remain completely intact and untranslated (do not translate "arabe" to "Arabic" or "verset" to "verse" or "douas" to "prayers"/"supplications"). Keep these specific terms exactly as "arabe", "verset", "doua" or "douas" in the final output.
7. JSON OUTPUT: Your output must match the requested JSON schema.

Input Article to Translate:
---
Title: ${title || ""}
---
Hook: ${hook || ""}
---
Content (Body to translate while keeping HTML tags): 
${content || ""}
---
Benefits: ${JSON.stringify(benefits || [])}
---
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
3. Do NOT translate the words "arabe", "verset", and "douas" (or "doua"). Keep these specific terms completely intact and unchanged (e.g., do not translate "arabe" to "Arabic", "verset" to "verse", or "doua" to "prayer").
4. NO TRANSLITERATION: Do NOT use or produce Latin/Roman transliterations of any Arabic words or Quranic verses (e.g., do not write out Arabic words or verses using the Latin/Roman alphabet). Keep Arabic script as-is, translate French, but never add Latin phonetic transliterations.
5. Keep the keys exactly as they are.

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
