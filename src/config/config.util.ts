import * as merge from 'deepmerge';

import { environment } from '../environments/environment';

import { hasNoValue } from '../app/shared/empty.util';

import { AppConfig } from './app-config.interface';
import { ThemeConfig } from './theme.model';

const extendEnvironmentWithAppConfig = (env: any, appConfig: AppConfig): void => {
  mergeConfig(env, appConfig);
  console.log(`Environment extended with app config`);
};

const mergeConfig = (config: any, appConfig: AppConfig): void => {
  const mergeOptions = {
    arrayMerge: (destinationArray, sourceArray, options) => sourceArray
  };
  Object.assign(config, merge.all([
    config,
    appConfig
  ], mergeOptions));
};

const getDefaultThemeConfig = (): ThemeConfig => {
  return environment.themes.find((themeConfig: any) =>
    hasNoValue(themeConfig.regex) &&
    hasNoValue(themeConfig.handle) &&
    hasNoValue(themeConfig.uuid)
  );
};

export {
  extendEnvironmentWithAppConfig,
  mergeConfig,
  getDefaultThemeConfig
};
