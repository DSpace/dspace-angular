import { ThemeService } from '../theme-support/theme.service';

export function getMockThemeService(): ThemeService {
  return jasmine.createSpyObj('themeService', {
    getThemeName: 'base'
  });
}
