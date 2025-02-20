import { isNotEmpty } from '@dspace/shared/utils';
import { of as observableOf } from 'rxjs';

import { ThemeService } from '../../shared/theme-support/theme.service';
import { ThemeConfig } from '../config/theme.config';

export function getMockThemeService(themeName = 'base', themes?: ThemeConfig[]): ThemeService {
  const spy = jasmine.createSpyObj('themeService', {
    getThemeName: themeName,
    getThemeName$: observableOf(themeName),
    getThemeConfigFor: undefined,
    listenForRouteChanges: undefined,
  });

  if (isNotEmpty(themes)) {
    spy.getThemeConfigFor.and.callFake((name: string) => themes.find(theme => theme.name === name));
  }

  return spy;
}
