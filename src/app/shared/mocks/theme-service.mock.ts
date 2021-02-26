import { ThemeService } from '../theme-support/theme.service';
import { of as observableOf } from 'rxjs';

export function getMockThemeService(themeName = 'base'): ThemeService {
  return jasmine.createSpyObj('themeService', {
    getThemeName: themeName,
    getThemeName$: observableOf(themeName)
  });
}
