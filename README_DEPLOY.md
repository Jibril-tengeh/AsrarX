# 📱 Guide de Déploiement Android & Google Play Store - AsrarHub

Ce guide explique étape par étape comment configurer, diagnostiquer, compiler et publier l'application **AsrarHub** sur le **Google Play Store** (format `.aab` - Android App Bundle) et comment générer un **APK direct** (`.apk`).

---

## 📋 1. Formats de Fichiers

| Format | Extension | Utilisation | Destination |
| :--- | :--- | :--- | :--- |
| **Android App Bundle** | `.aab` | Format officiel et obligatoire pour Google Play | **Google Play Console** |
| **APK Release** | `.apk` | Fichier exécutable installable directement | Téléphones Android, WhatsApp, Web |

---

## 🔍 2. Diagnostic Automatique du Projet

Avant de compiler, vérifiez que tous les fichiers requis sont en place :

```bash
npm run diagnose-build
```

Ce script vérifie automatiquement :
1. ✅ La présence et la validité de `android/app/google-services.json` (Configuration Firebase).
2. ✅ La présence des liaisons Gradle Capacitor (`capacitor.build.gradle`).
3. ✅ La présence du fichier de signature `android/asrarhub.keystore`.
4. ✅ La présence des règles ProGuard optimisées (`android/app/proguard-rules.pro`).
5. ✅ La cohérence des versions (`versionName` et `versionCode`).
6. ✅ La compilation des ressources web dans le dossier `dist/`.

---

## 🔢 3. Gestion des Versions (`versionCode` & `versionName`)

Google Play Store exige que chaque nouvelle mise à jour possède un **`versionCode` strictement supérieur** au précédent.

### Emplacement des variables dans `android/app/build.gradle` :
```groovy
defaultConfig {
    applicationId "com.asrarhub.app"
    minSdkVersion rootProject.ext.minSdkVersion
    targetSdkVersion rootProject.ext.targetSdkVersion
    versionCode project.hasProperty('versionCode') ? project.property('versionCode').toInteger() : 10
    versionName "1.1.1"
    testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
}
```

### Commandes pour incrémenter automatiquement la version :
- **Patch (ex: 1.1.1 ➔ 1.1.2)** :
  ```bash
  npm run version:patch
  ```
- **Minor (ex: 1.1.2 ➔ 1.2.0)** :
  ```bash
  npm run version:minor
  ```
- **Major (ex: 1.2.0 ➔ 2.0.0)** :
  ```bash
  npm run version:major
  ```
- **Synchroniser sans changer le numéro** :
  ```bash
  npm run version:sync
  ```

---

## 🛠️ 4. Préparation et Synchronisation Capacitor

Pour compiler l'application web, synchroniser les plugins et vérifier `google-services.json` :

```bash
# Compiler le web et synchroniser le dossier natif Android :
npm run prepare:android
```

Pour synchroniser et ouvrir directement dans Android Studio :
```bash
npm run cap:open
```

---

## 🚀 5. Générer l'App Bundle (.aab) pour Google Play

### Méthode Directe (NPM) :
```bash
npm run build:aab
```

### Méthode Manuelle (Gradle) :
```bash
# 1. Compiler le web et synchroniser
npm run build
npx cap sync android

# 2. Compiler le bundle
cd android
./gradlew bundleRelease
```

📁 **Fichier généré :**
```text
android/app/build/outputs/bundle/release/app-release.aab
```
> Ce fichier `.aab` est déjà **signé** avec votre clé `asrarhub.keystore` et prêt à être téléversé dans la console Google Play.

---

## 📱 6. Générer l'APK pour Installation Directe

### Méthode Directe (NPM) :
```bash
npm run build:apk
```

### Méthode Manuelle (Gradle) :
```bash
cd android
./gradlew assembleRelease
```

📁 **Fichier généré :**
```text
android/app/build/outputs/apk/release/app-release.apk
```

---

## 🔐 7. Informations de Signature (Keystore)

Le fichier `android/asrarhub.keystore` est préconfiguré dans `android/app/build.gradle` :
- **Chemin du fichier :** `android/asrarhub.keystore`
- **Mot de passe Keystore :** `asrarhub2026`
- **Alias de la clé :** `asrarhub`
- **Mot de passe de la clé :** `asrarhub2026`

Si vous devez régénérer une nouvelle clé :
```bash
keytool -genkeypair -v \
  -keystore android/asrarhub.keystore \
  -alias asrarhub \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass asrarhub2026 \
  -keypass asrarhub2026 \
  -dname "CN=AsrarHub, OU=App, O=AsrarHub, L=Dakar, ST=DK, C=SN"
```

---

## 🌐 8. Téléversement sur Google Play Console

1. Connectez-vous sur [Google Play Console](https://play.google.com/console).
2. Sélectionnez votre application **AsrarHub** (ou cliquez sur **Créer une application**).
3. Dans le menu de gauche, rendez-vous dans **Production** (ou **Test fermé / Test interne**).
4. Cliquez sur **Créer une version**.
5. Glissez-déposez le fichier **`app-release.aab`** généré à l'étape 5.
6. Renseignez les notes de version (ex: *"Améliorations de performance et corrections"*).
7. Cliquez sur **Enregistrer** puis **Examiner la version** et enfin **Lancer le déploiement**.

---

## ☁️ 9. Compilation Cloud Automatique (GitHub Actions)

Si vous développez sur smartphone ou que votre ordinateur n'a pas Android Studio / Java 17 installé :

1. Allez sur votre dépôt **GitHub** > onglet **Actions**.
2. Sélectionnez le workflow **`Android Build`**.
3. Cliquez sur **Run workflow** sur la branche `main`.
4. Après ~2 minutes, téléchargez vos fichiers dans la section **Artifacts** :
   - 📦 `AsrarHub-PlayStore-AAB` (`app-release.aab`)
   - 📱 `AsrarHub-Release-APK` (`app-release.apk`)

---

## ❓ 10. Dépannage des Erreurs Fréquentes

### Erreur : `File google-services.json is missing`
👉 Assurez-vous que le fichier est bien présent dans `android/app/google-services.json`. Lancez `npm run diagnose-build` pour vérifier.

### Erreur : `versionCode already used` sur Google Play
👉 Google Play n'accepte pas deux fichiers avec le même code de version. Exécutez :
```bash
npm run version:patch
```
Puis relancez la génération de l'App Bundle.

### Erreur : Runtime Crash avec ProGuard activé
👉 Le fichier `android/app/proguard-rules.pro` a été configuré avec toutes les règles d'exclusion pour Capacitor, Firebase, WebViews et OkHttp pour éviter tout plantage lors de l'obfuscation R8.
