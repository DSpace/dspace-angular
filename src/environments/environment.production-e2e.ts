import { BuildConfig } from '../config/build-config.interface';
import { environment as prodEnvironment } from './environment.production';

export const environment: Partial<BuildConfig> = Object.assign(
  {},
  prodEnvironment,
  {
    isE2E: true,
  },
);
