import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.asrarhub.app',
  appName: 'AsrarHub',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    cleartext: true
  },
  plugins: {
    AdMob: {
      // In mobile AdMob, the application ID MUST be specified in the configuration,
      // otherwise Google Mobile Ads SDK will crash the application immediately on launch.
      // We provide a safe default Google AdMob test App ID for Android and iOS.
      appId: 'ca-app-pub-3940256099942544~3347511713'
    }
  }
};

export default config;
