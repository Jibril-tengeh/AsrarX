const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function logHeader(title) {
  console.log(`\n${colors.bold}${colors.cyan}══════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}  🔍 DIAGNOSTIC DE BUILD ANDROID & PLAY STORE - ASRARHUB${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}══════════════════════════════════════════════════════════════${colors.reset}\n`);
}

function checkItem(name, checkFn, adviceIfFail) {
  try {
    const result = checkFn();
    if (result.ok) {
      console.log(`  ${colors.green}✔ [OK]${colors.reset} ${name}: ${colors.bold}${result.message}${colors.reset}`);
      return true;
    } else {
      console.log(`  ${colors.red}✖ [MANQUANT / ERREUR]${colors.reset} ${name}: ${colors.yellow}${result.message}${colors.reset}`);
      if (adviceIfFail) {
        console.log(`     ${colors.yellow}➔ Conseil : ${adviceIfFail}${colors.reset}`);
      }
      return false;
    }
  } catch (err) {
    console.log(`  ${colors.red}✖ [ERREUR CRITIQUE]${colors.reset} ${name}: ${err.message}`);
    if (adviceIfFail) {
      console.log(`     ${colors.yellow}➔ Conseil : ${adviceIfFail}${colors.reset}`);
    }
    return false;
  }
}

logHeader();

let allPassed = true;

// 1. Check android/app/google-services.json
const googleServicesPassed = checkItem(
  'Configuration Firebase (google-services.json)',
  () => {
    const p1 = path.join(rootDir, 'android', 'app', 'google-services.json');
    const p2 = path.join(rootDir, 'android', 'google-services.json');
    const targetPath = fs.existsSync(p1) ? p1 : (fs.existsSync(p2) ? p2 : null);

    if (!targetPath) {
      return { ok: false, message: 'Le fichier google-services.json est introuvable dans android/app/.' };
    }

    try {
      const content = fs.readFileSync(targetPath, 'utf8');
      const json = JSON.parse(content);
      const projectNumber = json.project_info?.project_number;
      const projectId = json.project_info?.project_id;
      const client = json.client?.[0];
      const packageName = client?.client_info?.android_client_info?.package_name;

      if (!projectId || !packageName) {
        return { ok: false, message: `Fichier présent (${path.relative(rootDir, targetPath)}) mais incomplet ou invalide.` };
      }

      return {
        ok: true,
        message: `Présent et valide (${packageName}, Project ID: ${projectId})`
      };
    } catch (e) {
      return { ok: false, message: `Erreur de syntaxe JSON dans ${targetPath}: ${e.message}` };
    }
  },
  'Téléchargez le fichier google-services.json depuis la console Firebase (Paramètres du projet > Vos applications Android) et placez-le dans android/app/google-services.json.'
);

if (!googleServicesPassed) allPassed = false;

// 2. Check capacitor.build.gradle / capacitor.settings.gradle
const capacitorGradlePassed = checkItem(
  'Configuration Gradle Capacitor (capacitor.build.gradle)',
  () => {
    const pApp = path.join(rootDir, 'android', 'app', 'capacitor.build.gradle');
    const pSettings = path.join(rootDir, 'android', 'capacitor.settings.gradle');
    
    const hasAppGradle = fs.existsSync(pApp);
    const hasSettingsGradle = fs.existsSync(pSettings);

    if (hasAppGradle) {
      return { ok: true, message: `Présent (android/app/capacitor.build.gradle)` };
    } else if (hasSettingsGradle) {
      return { ok: true, message: `Présent (android/capacitor.settings.gradle)` };
    } else {
      return { ok: false, message: 'Fichiers de liaison Capacitor Gradle introuvables.' };
    }
  },
  'Exécutez "npx cap sync android" ou "npm run build:android" pour régénérer automatiquement les liaisons Capacitor Gradle.'
);

if (!capacitorGradlePassed) allPassed = false;

// 3. Check Keystore de signature
const keystorePassed = checkItem(
  'Clé de signature Android (Keystore)',
  () => {
    const locations = [
      path.join(rootDir, 'android', 'asrarhub.keystore'),
      path.join(rootDir, 'android', 'app', 'asrarhub.keystore'),
      path.join(rootDir, 'asrarhub.keystore')
    ];

    const found = locations.find(p => fs.existsSync(p));
    if (found) {
      const stats = fs.statSync(found);
      return {
        ok: true,
        message: `Trouvé (${path.relative(rootDir, found)}, taille: ${stats.size} octets)`
      };
    }

    return { ok: false, message: 'Aucun fichier asrarhub.keystore trouvé dans android/ ou android/app/.' };
  },
  'Générez la clé via keytool : keytool -genkeypair -v -keystore android/asrarhub.keystore -alias asrarhub -keyalg RSA -keysize 2048 -validity 10000 -storepass AsrarHub1492 -keypass AsrarHub1492'
);

if (!keystorePassed) allPassed = false;

// 4. Check Proguard Rules
const proguardPassed = checkItem(
  'Règles ProGuard / R8 (proguard-rules.pro)',
  () => {
    const p = path.join(rootDir, 'android', 'app', 'proguard-rules.pro');
    if (!fs.existsSync(p)) {
      return { ok: false, message: 'Fichier android/app/proguard-rules.pro introuvable.' };
    }
    const content = fs.readFileSync(p, 'utf8');
    const hasCapacitorRules = content.includes('com.getcapacitor');
    return {
      ok: true,
      message: `Présent (${hasCapacitorRules ? 'Règles Capacitor & Firebase incluses' : 'Règles par défaut'})`
    };
  },
  'Assurez-vous que le fichier android/app/proguard-rules.pro contient les règles de protection Capacitor et Firebase.'
);

if (!proguardPassed) allPassed = false;

// 5. Check Package Version & Gradle Sync
const versionPassed = checkItem(
  'Synchronisation des versions (versionName & versionCode)',
  () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
    const gradleFile = path.join(rootDir, 'android', 'app', 'build.gradle');
    if (!fs.existsSync(gradleFile)) {
      return { ok: false, message: 'android/app/build.gradle introuvable.' };
    }
    const gradleContent = fs.readFileSync(gradleFile, 'utf8');
    const codeMatch = gradleContent.match(/versionCode\s+(?:project\.hasProperty\([^)]+\)\s*\?[^:]+:\s*)?(\d+)/);
    const nameMatch = gradleContent.match(/versionName\s+["']([^"']+)["']/);

    const vCode = codeMatch ? codeMatch[1] : 'Inconnu';
    const vName = nameMatch ? nameMatch[1] : 'Inconnu';

    return {
      ok: true,
      message: `Package.json: v${pkg.version} ➔ Gradle: versionName "${vName}", versionCode ${vCode}`
    };
  },
  'Exécutez "npm run sync-version" pour synchroniser la version du package.json vers Android Gradle.'
);

if (!versionPassed) allPassed = false;

// 6. Check Web Assets Build (dist/ folder)
const distPassed = checkItem(
  'Ressources Web compilées (Dossier dist/)',
  () => {
    const distPath = path.join(rootDir, 'dist');
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(distPath) && fs.existsSync(indexPath)) {
      return { ok: true, message: `Dossier dist/ prêt avec index.html` };
    }
    return { ok: false, message: 'Dossier dist/ ou dist/index.html manquant.' };
  },
  'Exécutez "npm run build" pour compiler le frontend avant de synchroniser avec Capacitor.'
);

if (!distPassed) allPassed = false;

console.log(`\n${colors.bold}──────────────────────────────────────────────────────────────${colors.reset}`);
if (allPassed) {
  console.log(`${colors.green}${colors.bold}  ✨ TOUTES LES VÉRIFICATIONS ONT RÉUSSI !${colors.reset}`);
  console.log(`  Votre projet est prêt pour générer l'APK et l'App Bundle Play Store (.aab).`);
  console.log(`  • Pour générer le bundle Play Store : ${colors.cyan}npm run build:aab${colors.reset} ou ${colors.cyan}cd android && ./gradlew bundleRelease${colors.reset}`);
  console.log(`  • Pour générer l'APK direct       : ${colors.cyan}npm run build:apk${colors.reset} ou ${colors.cyan}cd android && ./gradlew assembleRelease${colors.reset}`);
} else {
  console.log(`${colors.yellow}${colors.bold}  ⚠️ CERTAINS ÉLÉMENTS NÉCESSITENT VOTRE ATTENTION.${colors.reset}`);
  console.log(`  Suivez les conseils ci-dessus pour corriger les points marqués en rouge avant de lancer la compilation.`);
}
console.log(`${colors.bold}──────────────────────────────────────────────────────────────${colors.reset}\n`);

process.exit(allPassed ? 0 : 1);
