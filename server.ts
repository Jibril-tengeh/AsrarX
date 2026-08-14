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
    if (!getApps().length) return null;
    return getFirestore();
  };

  // General body parsing for other endpoints
  app.use(express.json());
  app.use(cors());

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

  // Helper for retrying Gemini API calls with model fallbacks and exponential backoff
  const generateWithRetry = async (ai: GoogleGenAI, params: any, retries = 3) => {
    const fallbackModels = ["gemini-3.7-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
    let currentModelIndex = 0;
    
    // If the caller provided a model, ensure it's first or replace outdated models
    if (params.model && !fallbackModels.includes(params.model)) {
      params.model = "gemini-3.7-flash";
    }

    for (let i = 0; i < retries; i++) {
      try {
        const modelToUse = fallbackModels[currentModelIndex] || "gemini-3.7-flash";
        const currentParams = { ...params, model: modelToUse };
        return await ai.models.generateContent(currentParams);
      } catch (error: any) {
        const errMsg = error?.message || "";
        const isRateLimit = error?.status === 429 || errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("quota");
        const isTransient = isRateLimit || error?.status === 503 || errMsg.includes("503") || errMsg.includes("Overloaded");
        
        console.warn(`[Gemini API] Call attempt ${i + 1}/${retries} failed on model '${fallbackModels[currentModelIndex]}':`, errMsg.slice(0, 150));

        if (isRateLimit && currentModelIndex < fallbackModels.length - 1) {
          // Try next fallback model immediately if quota exhausted
          currentModelIndex++;
          console.info(`[Gemini API] Switching to fallback model '${fallbackModels[currentModelIndex]}' due to rate limit/quota.`);
          continue;
        }

        if (i === retries - 1 || !isTransient) {
          throw error;
        }

        // Try extracting retry delay from error if specified
        let waitMs = (1000 * Math.pow(2, i)) + Math.floor(Math.random() * 500);
        const retryMatch = errMsg.match(/retry in ([0-9.]+)s/i);
        if (retryMatch && retryMatch[1]) {
          const seconds = parseFloat(retryMatch[1]);
          if (!isNaN(seconds) && seconds > 0 && seconds < 10) {
            waitMs = Math.min(seconds * 1000, 8000);
          }
        }

        await new Promise(resolve => setTimeout(resolve, waitMs));
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
        model: "gemini-3.7-flash",
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

  // Dream Interpretation via Gemini - Based on Classical Islamic Scholars (Ibn Sirin, Al-Nabulsi, Ibn Shahin, Imam Al-Sadiq)
  app.post("/api/dreams/interpret", async (req, res) => {
    try {
      const { title, content, type, wirdDone, language } = req.body;
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

      const langName = language === 'en' ? 'English' : language === 'ha' ? 'Hausa (with French for technical terms)' : 'French';

      const prompt = `
Vous êtes un maître érudit en herméneutique onirique islamique (Tafsīr al-Aḥlām / Ta'bīr al-Ru'yā), expert des sources et ouvrages classiques de référence :
1. **L'Imam Muhammad Ibn Sīrīn** (تعبير الرؤيا / منتخب الكلام في تفسير الأحلام) - Fondateur de la science des symboles et analogies coraniques.
2. **L'Imam 'Abdul-Ghanī Al-Nābulusī** (تعطير الأنام في تعبير المنام) - Expert des dictionnaire des symboles et nuances psychologico-spirituelles.
3. **L'Imam Ibn Shāhīn Al-Ẓāhirī** (الإشارات في علم الإشارات) - Analyse selon le rang, l'état de pureté et la situation du rêveur.
4. **L'Imam Ja'far Al-Ṣādiq** (décryptage par facettes et aspects multiples).

Récit du rêve transmis par le croyant :
- **Titre / Sujet principal** : ${title}
- **Récit détaillé** : ${content}
- **Nature supposée** : ${type || "Non défini"}
- **Prélude spirituel / Zikr avant le sommeil** : ${wirdDone || "Aucun spécifié"}

INSTRUCTIONS STRICTES DE RÉDACTION (Exprimez-vous en ${langName}) :

Formatez votre interprétation de manière structurée et élégante en Markdown :

### 1. 🌙 Classification & Nature Onirique (Sunnah)
- Déterminez la nature du rêve : **Rū'yā Raḥmāniyya** (Vision véridique et divine), **Ḥulm Nafsānī** (Reflet des préoccupations intérieures), ou **Ḥulm Shayṭānī** (Cauchemar perturbateur).
- Expliquez le rôle éventuel du Zikr ou de l'état spirituel avant le sommeil.

### 2. 📜 Décryptage Symbolique selon Ibn Sirin (الإمام ابن سيرين)
- Analysez les symboles majeurs (ex: eau, clés, ciel, vol, serpents, lumière, vêtements, fruits, personnes, lieux).
- Citez les analogies coraniques et hadiths associées par Ibn Sirin.

### 3. 🕊️ Éclairage d'Al-Nabulsi & Ibn Shahin (النابلسي وابن شاهين)
- Apportez les nuances d'Al-Nabulsi (aspect matériel vs spirituel, réjouissance ou avertissement).
- Intégrez la grille de lecture d'Ibn Shahin (différence selon que le rêveur est pieux, en épreuve, ou recherche une subsistance).

### 4. 🌟 Facettes & Aspects selon l'Imam Ja'far Al-Sadiq (الإمام جعفر الصادق)
- Décomposez les symboles fondamentaux en facettes explicites (ex: *"Les savants et l'Imam Ja'far al-Sadiq associent à ce symbole 4 facettes : 1. Élévation spirituelle, 2. Subsistance bénie, 3. Résolution d'un tracas, 4. Paix de l'âme"*).

### 5. 🤲 Conseils Spirituels & Éthique du Rêveur (Ādāb al-Ru'yā)
- Donnez les recommandations concrètes de la Sunnah selon la nature du rêve (remerciements, discrétion, aumône, ou demande de protection).
- Proposez une courte invocation (Doua en arabe avec traduction) ou un Zikr apaisant adapté.

**ÉTHIQUE ISLAMIQUE FONDAMENTALE** :
- Ne prétendez jamais prédire l'avenir. L'Inconnaissable (Al-Ghayb) appartient à Allah Seul.
- Concluez IMPÉRATIVEMENT par : **"Wa Allāhu A'lam" (والله أعلم - Et Allah sait mieux)**.
`;

      const response = await generateWithRetry(ai, {
        model: "gemini-3.7-flash",
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
        model: "gemini-3.7-flash",
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

  // Za'irja AI Oracle & Prophetic Poetry
  app.post("/api/zairja/oracle", async (req, res) => {
    try {
      const { question, abjadSum, language } = req.body;
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
Vous êtes le maître gardien de la Za'irja (الزايرجة de Tlemsani & Ibn Khaldoun), la matrice ésotérique soufie d'Iqtiran et d'Abjad.
L'utilisateur pose la question complexe suivante :
"${question}"
Valeur numérique Abjad Jummal calculée : ${abjadSum || 129}

Tâche :
Utilisez la poésie soufie prophétique et la sagesse des lettres (Ilm al-Huruf) pour composer un poème répondeur rythmé et rimé, sous la forme d'un verset/poème sacré (Bayt / Qasida) en arabe avec tashkeel complet, accompagné de sa traduction fluide et d'une exégèse spirituelle.

RÈGLES STRICTES :
1. "arabicVerse": Un poème ou verset rimé de 2 à 4 lignes en alphabet arabe original avec voyelles (tashkeel).
2. "translation": La traduction française/anglaise poétique et élégante du poème.
3. "interpretation": Une explication ésotérique spirituelle apaisante (Sharh) de 3 à 4 phrases pour guider le questionneur.
4. "recommendedDhikr": Le Nom Divin ou verset recommandé avec le nombre de répétitions (ex: "Ya Latif (129 fois) - Pour dénouer l'épreuve").
5. "numericString": Une suite de 5 à 7 nombres séparés par des tirets représentant la corde numérique de la Za'irja.

Ne mettez aucun texte d'enrobage avant ou après le JSON.
`;

      const response = await generateWithRetry(ai, {
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              arabicVerse: { type: "STRING", description: "Rhyming Arabic poem with tashkeel" },
              translation: { type: "STRING", description: "Translation of the poem" },
              interpretation: { type: "STRING", description: "Spiritual commentary and advice" },
              recommendedDhikr: { type: "STRING", description: "Associated Dhikr and count" },
              numericString: { type: "STRING", description: "Crypted numeric string" }
            },
            required: ["arabicVerse", "translation", "interpretation", "recommendedDhikr", "numericString"]
          }
        }
      });

      const resultText = response?.text?.trim() || "{}";
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
        model: "gemini-3.7-flash",
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
        model: "gemini-3.7-flash",
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
        model: "gemini-3.7-flash",
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

      const resultText = response?.text?.trim() || "{}";
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
      if (!apiKey) {
        return res.status(500).json({ error: "Gemini API key is not configured" });
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
        model: "gemini-3.7-flash",
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
      setCachedTranslation(cacheKey, translatedData);
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

      // Check server cache first
      const cacheKey = `txt_${targetLanguage}_${JSON.stringify(texts || {})}`;
      const cached = getCachedTranslation(cacheKey);
      if (cached) {
        return res.json(cached);
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
        model: "gemini-3.7-flash",
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
      setCachedTranslation(cacheKey, translatedData);
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
        model: "gemini-3.7-flash",
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

      if (apiKey) {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });

        // Prompt expansion using gemini-3.7-flash
        try {
          const promptExpansion = await generateWithRetry(ai, {
            model: "gemini-3.7-flash",
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

        // Try Imagen 3.0 image generation
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
