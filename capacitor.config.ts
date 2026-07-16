import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.asrarhub.app',
  appName: 'AsrarHub',
  webDir: 'dist',
  plugins: {
    CapacitorHttp: {
      enabled: false
    },
    CapacitorCookies: {
      enabled: true
    }
  }
};

export default config;
