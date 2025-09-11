import { all } from 'deepmerge';

import { AppConfig } from '../../projects/dspace/config/src/lib/app-config.interface';

/**
 * Extend Angular environment with app config.
 *
 * @param env       environment object
 * @param appConfig app config
 */
const extendEnvironmentWithAppConfig = (env: any, appConfig: AppConfig): void => {
  mergeConfig(env, appConfig);
  console.log(`Environment extended with app config`);
};

/**
 * Merge one config into another.
 *
 * @param destinationConfig destination config
 * @param sourceConfig      source config
 */
const mergeConfig = (destinationConfig: any, sourceConfig: AppConfig): void => {
  const mergeOptions = {
    arrayMerge: (destinationArray, sourceArray, options) => sourceArray,
  };
  Object.assign(destinationConfig, all([
    destinationConfig,
    sourceConfig,
  ], mergeOptions));
};

export {
  extendEnvironmentWithAppConfig,
  mergeConfig,
};
