const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const packageJsonPath = path.join(rootDir, 'package.json');
const gradlePath = path.join(rootDir, 'android', 'app', 'build.gradle');
const appVersionConfigPath = path.join(rootDir, 'src', 'config', 'appVersion.ts');

function syncAndroidVersion() {
  console.log('🔄 [Version Sync] Synchronizing package.json version with android/app/build.gradle...');

  // 1. Read package.json
  if (!fs.existsSync(packageJsonPath)) {
    console.error('❌ package.json not found at:', packageJsonPath);
    return;
  }

  const pkgRaw = fs.readFileSync(packageJsonPath, 'utf8');
  const pkg = JSON.parse(pkgRaw);
  const pkgVersion = pkg.version || '1.1.0';

  // 2. Read android/app/build.gradle
  if (!fs.existsSync(gradlePath)) {
    console.warn('⚠️ android/app/build.gradle not found at:', gradlePath);
    return;
  }

  let gradleContent = fs.readFileSync(gradlePath, 'utf8');

  // Extract current versionCode and versionName
  let currentVersionCode = 1;
  let currentVersionName = '1.0';

  const codeMatch = gradleContent.match(/versionCode\s+(?:project\.hasProperty\([^)]+\)\s*\?[^:]+:\s*)?(\d+)/);
  if (codeMatch) {
    currentVersionCode = parseInt(codeMatch[1], 10);
  }

  const nameMatch = gradleContent.match(/versionName\s+["']([^"']+)["']/);
  if (nameMatch) {
    currentVersionName = nameMatch[1];
  }

  // Determine target versionName (e.g. "1.1" or full "1.1.1")
  const targetVersionName = pkgVersion;
  
  // Check if --bump flag is passed
  const shouldBump = process.argv.includes('--bump');
  const targetVersionCode = shouldBump ? currentVersionCode + 1 : currentVersionCode;

  console.log(`📱 Current Gradle: versionCode ${currentVersionCode}, versionName "${currentVersionName}"`);
  console.log(`📦 Package.json:   version ${pkgVersion}`);
  console.log(`🎯 Target Gradle:  versionCode ${targetVersionCode}, versionName "${targetVersionName}"`);

  // Update gradle content
  const updatedGradle = gradleContent
    .replace(/versionCode\s+(?:project\.hasProperty\([^)]+\)\s*\?[^:]+:\s*)?\d+/, `versionCode project.hasProperty('versionCode') ? project.property('versionCode').toInteger() : ${targetVersionCode}`)
    .replace(/versionName\s+["'][^"']+["']/, `versionName "${targetVersionName}"`);

  if (updatedGradle !== gradleContent) {
    fs.writeFileSync(gradlePath, updatedGradle, 'utf8');
    console.log('✅ android/app/build.gradle successfully updated!');
  } else {
    console.log('✨ android/app/build.gradle is already in sync.');
  }

  // 3. Update src/config/appVersion.ts if needed
  if (fs.existsSync(appVersionConfigPath)) {
    let configContent = fs.readFileSync(appVersionConfigPath, 'utf8');
    const updatedConfig = configContent
      .replace(/currentVersionCode:\s*\d+/, `currentVersionCode: ${targetVersionCode}`);
    if (updatedConfig !== configContent) {
      fs.writeFileSync(appVersionConfigPath, updatedConfig, 'utf8');
      console.log('✅ src/config/appVersion.ts synchronized!');
    }
  }

  console.log(`🚀 Version synchronization completed successfully.`);
}

syncAndroidVersion();
