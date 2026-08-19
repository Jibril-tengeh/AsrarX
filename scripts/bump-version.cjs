const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const packageJsonPath = path.join(rootDir, 'package.json');
const gradlePath = path.join(rootDir, 'android', 'app', 'build.gradle');
const appVersionConfigPath = path.join(rootDir, 'src', 'config', 'appVersion.ts');

function bumpVersion() {
  console.log('🚀 [Version Auto-Bump] Synchronizing and incrementing version...');

  // 1. Read package.json
  const pkgRaw = fs.readFileSync(packageJsonPath, 'utf8');
  const pkg = JSON.parse(pkgRaw);
  let currentPkgVersion = pkg.version || '1.1.0';

  // Determine bump type from arguments (e.g. node bump-version.cjs patch/minor/major)
  const arg = process.argv[2] || 'auto'; // 'auto', 'patch', 'minor', 'major'
  const versionParts = currentPkgVersion.split('.').map(Number);

  let newPkgVersion = currentPkgVersion;
  if (arg === 'major') {
    newPkgVersion = `${versionParts[0] + 1}.0.0`;
  } else if (arg === 'minor') {
    newPkgVersion = `${versionParts[0]}.${(versionParts[1] || 0) + 1}.0`;
  } else if (arg === 'patch') {
    newPkgVersion = `${versionParts[0]}.${versionParts[1] || 0}.${(versionParts[2] || 0) + 1}`;
  }

  // 2. Read android/app/build.gradle
  let currentVersionCode = 2;
  let currentVersionName = '1.1';
  let gradleContent = '';

  if (fs.existsSync(gradlePath)) {
    gradleContent = fs.readFileSync(gradlePath, 'utf8');

    const codeMatch = gradleContent.match(/versionCode\s+(\d+)/);
    if (codeMatch) {
      currentVersionCode = parseInt(codeMatch[1], 10);
    }

    const nameMatch = gradleContent.match(/versionName\s+["']([^"']+)["']/);
    if (nameMatch) {
      currentVersionName = nameMatch[1];
    }
  }

  // Increment versionCode
  const newVersionCode = currentVersionCode + 1;
  const newVersionName = newPkgVersion.split('.').slice(0, 2).join('.'); // e.g. "1.1"

  console.log(`📦 Previous: Version ${currentPkgVersion} (Code ${currentVersionCode})`);
  console.log(`✨ New:      Version ${newPkgVersion} / Android "${newVersionName}" (Code ${newVersionCode})`);

  // 3. Write package.json
  pkg.version = newPkgVersion;
  fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
  console.log('✅ Updated package.json');

  // 4. Write android/app/build.gradle
  if (gradleContent) {
    let updatedGradle = gradleContent
      .replace(/versionCode\s+\d+/, `versionCode ${newVersionCode}`)
      .replace(/versionName\s+["'][^"']+["']/, `versionName "${newVersionName}"`);
    fs.writeFileSync(gradlePath, updatedGradle, 'utf8');
    console.log('✅ Updated android/app/build.gradle');
  }

  // 5. Update src/config/appVersion.ts
  if (fs.existsSync(appVersionConfigPath)) {
    let configContent = fs.readFileSync(appVersionConfigPath, 'utf8');
    const today = new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    configContent = configContent
      .replace(/currentVersion:\s*['"][^'"]+['"]/, `currentVersion: '${newPkgVersion}'`)
      .replace(/currentVersionCode:\s*\d+/, `currentVersionCode: ${newVersionCode}`);

    fs.writeFileSync(appVersionConfigPath, configContent, 'utf8');
    console.log('✅ Updated src/config/appVersion.ts');
  }

  console.log(`🎉 Version successfully bumped to ${newPkgVersion} (Build ${newVersionCode})!`);
}

bumpVersion();
