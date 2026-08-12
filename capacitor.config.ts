import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.asrarhub.app',
  appName: 'AsrarHub',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
    allowNavigation: ['*']
  },
  plugins: {
    CapacitorHttp: {
      enabled: false
    },
    CapacitorCookies: {
      enabled: false
    }
  }
};

export default config;
