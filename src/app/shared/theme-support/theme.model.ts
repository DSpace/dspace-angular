/* eslint-disable max-classes-per-file */
import { hasValue, hasNoValue, isNotEmpty } from '../empty.util';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { getDSORoute } from '../../app-routing-paths';
import { HandleObject } from '../../core/shared/handle-object.model';
import { Injector } from '@angular/core';
import { HandleService } from '../handle.service';
import { combineLatest, Observable, of as observableOf } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { HandleThemeConfig, NamedThemeConfig, RegExThemeConfig, UUIDThemeConfig, ThemeConfig } from '../../../config/theme.config';

export class Theme {
  constructor(public config: NamedThemeConfig) {
  }

  matches(url: string, dso: DSpaceObject): Observable<boolean> {
    return observableOf(true);
  }
}

export class RegExTheme extends Theme {
  regex: RegExp;

  constructor(public config: RegExThemeConfig) {
    super(config);
    this.regex = new RegExp(this.config.regex);
  }

  matches(url: string, dso: DSpaceObject): Observable<boolean> {
    let match: RegExpMatchArray;
    const route = getDSORoute(dso);

    if (isNotEmpty(route)) {
      match = route.match(this.regex);
    }

    if (hasNoValue(match)) {
      match = url.match(this.regex);
    }

    return observableOf(hasValue(match));
  }
}

export class HandleTheme extends Theme {

  constructor(public config: HandleThemeConfig,
              protected handleService: HandleService
  ) {
    super(config);
  }

  matches<T extends DSpaceObject & HandleObject>(url: string, dso: T): Observable<boolean> {
    if (hasValue(dso?.handle)) {
      return combineLatest([
        this.handleService.normalizeHandle(dso?.handle),
        this.handleService.normalizeHandle(this.config.handle),
      ]).pipe(
        map(([handle, normalizedHandle]: [string | null, string | null]) => {
          return hasValue(dso) && hasValue(dso.handle) && handle === normalizedHandle;
        }),
        take(1),
      );
    } else {
      return observableOf(false);
    }
  }
}

export class UUIDTheme extends Theme {
  constructor(public config: UUIDThemeConfig) {
    super(config);
  }

  matches(url: string, dso: DSpaceObject): Observable<boolean> {
    return observableOf(hasValue(dso) && dso.uuid === this.config.uuid);
  }
}

export const themeFactory = (config: ThemeConfig, injector: Injector): Theme => {
  if (hasValue((config as RegExThemeConfig).regex)) {
    return new RegExTheme(config as RegExThemeConfig);
  } else if (hasValue((config as HandleThemeConfig).handle)) {
    return new HandleTheme(config as HandleThemeConfig, injector.get(HandleService));
  } else if (hasValue((config as UUIDThemeConfig).uuid)) {
    return new UUIDTheme(config as UUIDThemeConfig);
  } else {
    return new Theme(config as NamedThemeConfig);
  }
};
