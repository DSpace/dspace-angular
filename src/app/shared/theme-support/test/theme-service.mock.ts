import { ThemeConfig } from '@dspace/config/theme.config';
import { isNotEmpty } from '@dspace/shared/utils/empty.util';
import { of } from 'rxjs';

import { ThemeService } from '../theme.service';

export function getMockThemeService(themeName = 'base', themes?: ThemeConfig[]): ThemeService {
  const spy = jasmine.createSpyObj('themeService', {
    getThemeName: themeName,
    getThemeName$: of(themeName),
    getThemeConfigFor: undefined,
    listenForRouteChanges: undefined,
  });

  if (isNotEmpty(themes)) {
    spy.getThemeConfigFor.and.callFake((name: string) => themes.find(theme => theme.name === name));
  }

  return spy;
}
