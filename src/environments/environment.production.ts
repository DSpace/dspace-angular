import { BuildConfig } from '../config/build-config.interface';

export const environment: Partial<BuildConfig> = {
  production: true,

  // Angular Universal settings
  universal: {
    preboot: true,
    async: true,
    time: false,
    inlineCriticalCss: false,
    transferState: true,
    replaceRestUrl: true,
    paths: [ '/home', '/items/', '/entities/', '/collections/', '/communities/', '/bitstream/', '/bitstreams/', '/handle/', '/reload/' ],
    enableSearchComponent: false,
    enableBrowseComponent: false,
  },
};
