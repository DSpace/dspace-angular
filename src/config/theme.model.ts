import { Config } from './config.interface';
import { hasValue, hasNoValue, isNotEmpty } from '../app/shared/empty.util';
import { DSpaceObject } from '../app/core/shared/dspace-object.model';
import { getDSORoute } from '../app/app-routing-paths';

// tslint:disable:max-classes-per-file
export interface NamedThemeConfig extends Config {
  name: string;

  /**
   * Specify another theme to build upon: whenever a themed component is not found in the current theme,
   * its ancestor theme(s) will be checked recursively before falling back to the default theme.
   */
  extends?: string;
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

export class Theme {
  constructor(public config: NamedThemeConfig) {
  }

  matches(url: string, dso: DSpaceObject): boolean {
    return true;
  }
}

export class RegExTheme extends Theme {
  regex: RegExp;

  constructor(public config: RegExThemeConfig) {
    super(config);
    this.regex = new RegExp(this.config.regex);
  }

  matches(url: string, dso: DSpaceObject): boolean {
    let match;
    const route = getDSORoute(dso);

    if (isNotEmpty(route)) {
      match = route.match(this.regex);
    }

    if (hasNoValue(match)) {
      match = url.match(this.regex);
    }

    return hasValue(match);
  }
}

export class HandleTheme extends Theme {
  constructor(public config: HandleThemeConfig) {
    super(config);
  }

  matches(url: string, dso: any): boolean {
    return hasValue(dso) && hasValue(dso.handle) && dso.handle.includes(this.config.handle);
  }
}

export class UUIDTheme extends Theme {
  constructor(public config: UUIDThemeConfig) {
    super(config);
  }

  matches(url: string, dso: DSpaceObject): boolean {
    return hasValue(dso) && dso.uuid === this.config.uuid;
  }
}

export const themeFactory = (config: ThemeConfig): Theme => {
  if (hasValue((config as RegExThemeConfig).regex)) {
    return new RegExTheme(config as RegExThemeConfig);
  } else if (hasValue((config as HandleThemeConfig).handle)) {
    return new HandleTheme(config as HandleThemeConfig);
  } else if (hasValue((config as UUIDThemeConfig).uuid)) {
    return new UUIDTheme(config as UUIDThemeConfig);
  } else {
    return new Theme(config as NamedThemeConfig);
  }
};

export type ThemeConfig
  = NamedThemeConfig
  | RegExThemeConfig
  | HandleThemeConfig
  | UUIDThemeConfig;
