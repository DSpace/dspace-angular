import { AppConfig, BASE_THEME_NAME, ThemeConfig, NamedThemeConfig } from '@dspace/config';
import { hasNoValue } from '@dspace/utils';


/**
 * Get default theme config from environment.
 *
 * @returns default theme config
 */
export const getDefaultThemeConfig = (environment: AppConfig): ThemeConfig => {
  return environment.themes.find((themeConfig: any) =>
    hasNoValue(themeConfig.regex) &&
    hasNoValue(themeConfig.handle) &&
    hasNoValue(themeConfig.uuid),
  ) ?? {
    name: BASE_THEME_NAME,
  } as NamedThemeConfig;
};
