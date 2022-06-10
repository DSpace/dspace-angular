import { BuildConfig } from '../config/build-config.interface';

export const environment: Partial<BuildConfig> = {
  production: true,

  // Angular Universal settings
  universal: {
    preboot: true,
    async: true,
    time: false
  },
  recaptchaSiteKey: '6LfmfEsgAAAAACNqQ0aHqJa0HOHcUsvv2OCiEbV4'
};
