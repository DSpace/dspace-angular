import { BuildConfig } from '../config/build-config.interface';

export const environment: Partial<BuildConfig> = {
  production: true,

  // Angular SSR settings
  ssr: {
    enabled: true,
    enablePerformanceProfiler: false,
    inlineCriticalCss: true,
  },
};
