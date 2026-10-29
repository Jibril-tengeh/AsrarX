/**
 * api/update-articles.js
 * API Serverless Vercel sécurisée pour AsrarHub / AsrarX
 * 
 * Objectifs de sécurité :
 * 1. Zéro fuite de GitHub Token (stocké exclusivement dans process.env.GITHUB_TOKEN sur Vercel)
 * 2. Protection absolue des secrets initiatiques :
 *    - Tout article avec isPremium: true est épuré de son 'contenu_secret'.
 *    - 'contenu_complet' est forcé à null dans le fichier public GitHub.
 *    - Le secret initiatique est stocké de manière sécurisée dans Firestore (collection privée 'articles_secrets').
 * 3. Authentification Admin requise via header 'x-admin-key'.
 */

import { Octokit } from "octokit";
import fs from "fs";
import path from "path";
import admin from "firebase-admin";

// Initialisation de Firebase Admin pour stockage confidentiel du secret
let adminDb = null;
function getAdminDb() {
  if (adminDb) return adminDb;
  try {
    if (!admin.getApps().length) {
      const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
      if (serviceAccountJson) {
        try {
          const creds = JSON.parse(serviceAccountJson);
          admin.initializeApp({ credential: admin.cert(creds) });
        } catch (e) {
          console.warn("[API] Firebase Admin parse warning:", e.message);
        }
      }
    }
    if (admin.getApps().length) {
      adminDb = admin.getFirestore();
    }
  } catch (e) {
    console.info("[API] Firebase Admin non disponible:", e.message);
  }
  return adminDb;
}

/**
 * Nettoyage et assainissement strict des articles avant commit sur GitHub public
 */
async function sanitizeArticles(articles, onSecretExtracted) {
  const sanitized = [];

  for (const raw of articles) {
    if (!raw || !raw.id) continue;

    const isPremium = Boolean(raw.isPremium || raw.premium);
    const item = { ...raw };

    if (isPremium) {
      // 1. Extraire le secret initiatique s'il a été saisi
      const secretContent = item.contenu_secret || item.secret || (item.contenu_complet && item.contenu_complet.length > 0 ? item.contenu_complet : null);

      if (secretContent && onSecretExtracted) {
        await onSecretExtracted(item.id, secretContent);
      }

      // 2. Élaguer impitoyablement tout contenu secret du fichier public
      delete item.contenu_secret;
      delete item.secret;
      delete item.secret_content;
      delete item.contenu_prive;

      // 3. Forcer contenu_complet à null pour GitHub public
      item.contenu_complet = null;
      item.content = null;
      item.isPremium = true;
    } else {
      // Pour les articles gratuits, pas de champ secret
      delete item.contenu_secret;
      delete item.secret;
      item.isPremium = false;
      item.contenu_complet = item.contenu_complet || item.content || "";
      item.content = item.contenu_complet;
    }

    // Assurer les champs minimaux
    item.titre = item.titre || item.title || "Sans titre";
    item.title = item.titre;
    item.image = item.image || item.imageUrl || "/assets/images/spiritual-herbs.svg";
    item.imageUrl = item.image;
    item.categorie = item.categorie || item.category || "Plantes et recettes";
    item.category = item.categorie;
    item.description = item.description || item.hook || "";
    item.hook = item.description;
    item.status = item.status || "Published";
    item.updatedAt = new Date().toISOString();

    sanitized.push(item);
  }

  return sanitized;
}

/**
 * Sauvegarde le secret initiatique dans Firestore privé (articles_secrets/{id})
 */
async function saveSecretToFirestore(articleId, secretText) {
  const db = getAdminDb();
  if (!db || !articleId || !secretText) return false;
  try {
    await db.collection("articles_secrets").doc(articleId).set({
      articleId,
      contenu_secret: secretText,
      updatedAt: new Date().toISOString(),
      isPremium: true
    }, { merge: true });
    console.log(`[API] Secret protégé avec succès dans Firestore pour l'article ${articleId}`);
    return true;
  } catch (error) {
    console.error(`[API] Erreur de sauvegarde du secret dans Firestore pour ${articleId}:`, error);
    return false;
  }
}

export default async function handler(req, res) {
  // En-têtes CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-admin-key");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée. Utilisez POST." });
  }

  // 1. Authentification Admin via Header
  const clientKey = req.headers["x-admin-key"] || 
                    (req.headers["authorization"] ? req.headers["authorization"].replace(/^Bearer\s+/i, "") : null);
  
  const expectedPassword = process.env.ADMIN_PASSWORD || process.env.ADMIN_API_KEY || "asrar_admin_2026";

  if (!clientKey || clientKey !== expectedPassword) {
    return res.status(401).json({
      error: "Accès refusé. Mot de passe administrateur invalide ou manquant dans le header 'x-admin-key'."
    });
  }

  const { action, article, articles: rawArticlesList, articleId } = req.body || {};

  try {
    // 2. Déterminer les paramètres GitHub
    const githubToken = process.env.GITHUB_TOKEN;
    const githubRepoFull = process.env.GITHUB_REPO || 
                           process.env.GITHUB_REPOSITORY || 
                           (process.env.VERCEL_GIT_REPO_OWNER && process.env.VERCEL_GIT_REPO_SLUG ? `${process.env.VERCEL_GIT_REPO_OWNER}/${process.env.VERCEL_GIT_REPO_SLUG}` : null);
    const githubBranch = process.env.GITHUB_BRANCH || "main";
    const filePath = "public/data/articles.json";

    // 3. Charger les articles actuels
    let currentArticles = [];
    let fileSha = null;
    let loadedFromGitHub = false;

    if (githubToken && githubRepoFull) {
      const [owner, repo] = githubRepoFull.split("/");
      const octokit = new Octokit({ auth: githubToken });

      try {
        const { data } = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: filePath,
          ref: githubBranch
        });

        if (data && data.content) {
          const contentStr = Buffer.from(data.content, "base64").toString("utf-8");
          currentArticles = JSON.parse(contentStr);
          fileSha = data.sha;
          loadedFromGitHub = true;
        }
      } catch (err) {
        if (err.status !== 404) {
          console.warn("[API] Avertissement lors de la lecture GitHub:", err.message);
        }
      }
    }

    // Fallback local si GitHub n'est pas accessible
    if (!loadedFromGitHub) {
      try {
        const localPath = path.join(process.cwd(), filePath);
        if (fs.existsSync(localPath)) {
          const fileStr = fs.readFileSync(localPath, "utf-8");
          currentArticles = JSON.parse(fileStr);
        }
      } catch (e) {
        console.warn("[API] Impossible de lire le fichier local:", e.message);
      }
    }

    if (!Array.isArray(currentArticles)) {
      currentArticles = [];
    }

    // 4. Appliquer l'action
    let secretsSavedCount = 0;
    const onSecretExtracted = async (id, secret) => {
      const saved = await saveSecretToFirestore(id, secret);
      if (saved) secretsSavedCount++;
    };

    if (action === "save_article" || (!action && article)) {
      if (!article || !article.id) {
        return res.status(400).json({ error: "Données de l'article invalides (id requis)." });
      }

      const index = currentArticles.findIndex(a => a.id === article.id);
      if (index >= 0) {
        currentArticles[index] = { ...currentArticles[index], ...article };
      } else {
        currentArticles.unshift(article);
      }
    } else if (action === "delete_article") {
      if (!articleId) {
        return res.status(400).json({ error: "Identifiant articleId requis pour la suppression." });
      }
      currentArticles = currentArticles.filter(a => a.id !== articleId);
    } else if (action === "sync_all" && Array.isArray(rawArticlesList)) {
      currentArticles = rawArticlesList;
    } else {
      return res.status(400).json({ error: "Action non reconnue." });
    }

    // 5. Nettoyage strict & protection Premium
    const sanitizedArticles = await sanitizeArticles(currentArticles, onSecretExtracted);
    const updatedJsonString = JSON.stringify(sanitizedArticles, null, 2);

    // 6. Sauvegarde locale sur disque si possible
    try {
      const localPath = path.join(process.cwd(), filePath);
      fs.writeFileSync(localPath, updatedJsonString, "utf-8");
    } catch (e) {
      // Ignoré sur Vercel serverless read-only
    }

    // 7. Commit & Push sécurisé sur GitHub via Octokit
    let githubCommit = null;
    if (githubToken && githubRepoFull) {
      const [owner, repo] = githubRepoFull.split("/");
      const octokit = new Octokit({ auth: githubToken });

      const commitMessage = action === "delete_article" 
        ? `[AsrarHub Admin] Suppression sécurisée de l'article ${articleId}`
        : `[AsrarHub Admin] Mise à jour sécurisée de articles.json (${sanitizedArticles.length} articles)`;

      const { data } = await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: filePath,
        message: commitMessage,
        content: Buffer.from(updatedJsonString, "utf-8").toString("base64"),
        branch: githubBranch,
        ...(fileSha ? { sha: fileSha } : {})
      });

      githubCommit = {
        sha: data.commit.sha,
        url: data.commit.html_url,
        message: commitMessage
      };
    }

    return res.status(200).json({
      success: true,
      message: "Articles mis à jour avec succès et secrets protégés.",
      articlesCount: sanitizedArticles.length,
      secretsSavedToFirestore: secretsSavedCount,
      githubPushed: Boolean(githubCommit),
      githubCommit,
      mode: githubToken ? "production_github" : "local_fallback"
    });

  } catch (error) {
    console.error("[API update-articles] Erreur:", error);
    return res.status(500).json({
      error: "Erreur interne lors de la mise à jour des articles.",
      details: error.message
    });
  }
}
