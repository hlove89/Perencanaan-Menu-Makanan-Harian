import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.menuharian.app',
  appName: 'Menu Harian', 
  webDir: 'www',
  
  plugins: {
    SplashSreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#fdf6f0',
      androidSplashResourceName: 'splash',
      showSpinner: false,
      splashFullScreen: true, 
      splashImmersive: true,
    },
  },
};

export default config;
