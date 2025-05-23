import { all } from 'deepmerge';

import { hasNoValue } from '../app/shared/empty.util';
import { BASE_THEME_NAME } from '../app/shared/theme-support/theme.constants';
import { environment } from '../environments/environment';
import { AppConfig } from './app-config.interface';
import {
  NamedThemeConfig,
  ThemeConfig,
} from './theme.config';

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
