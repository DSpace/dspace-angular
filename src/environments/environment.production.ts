import { BuildConfig } from '../config/build-config.interface';

export const environment: Partial<BuildConfig> = {
  production: false,

  // Angular Universal settings
  universal: {
    preboot: true,
    async: true,
    time: false
  }
};
