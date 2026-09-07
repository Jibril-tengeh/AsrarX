const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = process.cwd();
const isOpening = process.argv.includes('--open');

console.log('\n🚀 [Capacitor Build Flow] Vérification des prérequis...');

// 1. Vérification de l'intégrité de google-services.json
const gservicesLocations = [
  path.join(rootDir, 'android', 'app', 'google-services.json'),
  path.join(rootDir, 'android', 'google-services.json')
];

let gservicesPath = gservicesLocations.find(p => fs.existsSync(p));

if (!gservicesPath) {
  console.error('\n❌ [Erreur Critique Firebase] Le fichier google-services.json est manquant !');
  console.error('   Veuillez placer votre fichier "google-services.json" dans le dossier "android/app/".');
  process.exit(1);
}

try {
  const content = fs.readFileSync(gservicesPath, 'utf8');
  const parsed = JSON.parse(content);
  const pkgName = parsed.client?.[0]?.client_info?.android_client_info?.package_name;
  if (!pkgName) {
    throw new Error('Propriété package_name manquante dans client_info.android_client_info');
  }
  console.log(`✅ [Firebase OK] google-services.json valide (Package: ${pkgName})`);

  // Assurer la copie dans android/app/ si placé à la racine de android/
  const appDestination = path.join(rootDir, 'android', 'app', 'google-services.json');
  if (gservicesPath !== appDestination) {
    fs.copyFileSync(gservicesPath, appDestination);
    console.log('✅ [Firebase Sync] google-services.json copié dans android/app/');
  }
} catch (err) {
  console.error('\n❌ [Erreur JSON Firebase] Le fichier google-services.json est invalide ou corrompu :');
  console.error(`   ${err.message}`);
  process.exit(1);
}

// 2. Synchronisation de la version
try {
  console.log('🔄 [Version Sync] Synchronisation des versions...');
  execSync('node scripts/sync-android-version.cjs', { stdio: 'inherit' });
} catch (e) {
  console.warn('⚠️ Avertissement lors de la synchronisation de version :', e.message);
}

// 3. Exécution de Capacitor Sync
try {
  console.log('📦 [Capacitor Sync] Synchronisation des fichiers web vers le projet natif Android...');
  execSync('npx cap sync android', { stdio: 'inherit' });
  console.log('✨ [Capacitor OK] Synchronisation terminée avec succès.');
} catch (e) {
  console.error('\n❌ [Capacitor Error] Échec de la synchronisation Capacitor :', e.message);
  process.exit(1);
}

// 4. Ouverture Android Studio si demandée
if (isOpening) {
  try {
    console.log('📱 [Android Studio] Ouverture du projet Android...');
    execSync('npx cap open android', { stdio: 'inherit' });
  } catch (e) {
    console.warn('⚠️ Note: Impossible d\'ouvrir automatiquement Android Studio (environnement sans interface graphique ou Android Studio non installé).');
    console.log('   Vous pouvez ouvrir le dossier "android" manuellement dans Android Studio.');
  }
}
