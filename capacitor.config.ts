import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'net.juron.app',
  appName: 'Juron Net',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    Geolocation: {
      permissions: ['location'],
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    Filesystem: {
      directory: 'Documents',
    },
    Network: {
      enabled: true,
    },
  },
};

export default config;
