import { Config } from './config';

export interface NamedThemeConfig {
  name: string;

  /**
   * Specify another theme to build upon: whenever a themed component is not found in the current theme,
   * its ancestor theme(s) will be checked recursively before falling back to the default theme.
   */
  extends?: string;

  /**
   * A list of HTML tags that should be added to the HEAD section of the document, whenever this theme is active.
   */
  headTags?: HeadTagConfig[];
}

/**
 * Interface that represents a single theme-specific HTML tag in the HEAD section of the page.
 */
export interface HeadTagConfig {
  /**
   * The name of the HTML tag
   */
  tagName: string;

  /**
   * The attributes on the HTML tag
   */
  attributes?: {
    [key: string]: string;
  };
}

export interface RegExThemeConfig extends NamedThemeConfig {
  regex: string;
}

export interface HandleThemeConfig extends NamedThemeConfig {
  handle: string;
}

export interface UUIDThemeConfig extends NamedThemeConfig {
  uuid: string;
}

export class ThemeConfig extends Config implements NamedThemeConfig, RegExThemeConfig, HandleThemeConfig, UUIDThemeConfig {
  @Config.publish() name: string;
  @Config.publish() extends?: string;
  @Config.publish() headTags?: HeadTagConfig[];
  @Config.publish() regex: string;
  @Config.publish() handle: string;
  @Config.publish() uuid: string;
}
export const BASE_THEME_NAME = 'base';
