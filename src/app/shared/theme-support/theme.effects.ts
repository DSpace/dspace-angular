import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { SetThemeAction } from './theme.actions';
import { environment } from '../../../environments/environment';
import { hasValue, hasNoValue } from '../empty.util';
import { BASE_THEME_NAME } from './theme.constants';

export const DEFAULT_THEME_CONFIG = environment.themes.find((themeConfig: any) =>
  hasNoValue(themeConfig.regex) &&
  hasNoValue(themeConfig.handle) &&
  hasNoValue(themeConfig.uuid)
);

@Injectable()
export class ThemeEffects {
  /**
   * Initialize with a theme that doesn't depend on the route.
   */
  initTheme$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map(() => {
        if (hasValue(DEFAULT_THEME_CONFIG)) {
          return new SetThemeAction(DEFAULT_THEME_CONFIG.name);
        } else {
          return new SetThemeAction(BASE_THEME_NAME);
        }
      })
    )
  );

  constructor(
    private actions$: Actions,
  ) {
  }
}
