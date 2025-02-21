import { all } from 'deepmerge';

// TODO: find a way to use the relative module path without braking the build
import { hasNoValue } from '../../modules/shared/utils/src/lib/utils/empty.util';
import { AppConfig } from '../../modules/core/src/lib/core/config/app-config.interface';
import {
  NamedThemeConfig,
  ThemeConfig,
} from '../../modules/core/src/lib/core/config/theme.config';
import { BASE_THEME_NAME } from '../../modules/core/src/lib/core/config/theme.constants';
import { environment } from '../environments/environment';

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

/**
 * Get default theme config from environment.
 *
 * @returns default theme config
 */
const getDefaultThemeConfig = (): ThemeConfig => {
  return environment.themes.find((themeConfig: any) =>
    hasNoValue(themeConfig.regex) &&
    hasNoValue(themeConfig.handle) &&
    hasNoValue(themeConfig.uuid),
  ) ?? {
    name: BASE_THEME_NAME,
  } as NamedThemeConfig;
};

export {
  extendEnvironmentWithAppConfig,
  getDefaultThemeConfig,
  mergeConfig,
};
