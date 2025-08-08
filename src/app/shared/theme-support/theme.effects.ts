import {
  Inject,
  Injectable,
} from '@angular/core';
import {
  APP_CONFIG,
  AppConfig,
} from '@dspace/config/app-config.interface';
import { getDefaultThemeConfig } from '@dspace/config/config.util';
import { BASE_THEME_NAME } from '@dspace/config/theme.config';
import { hasValue } from '@dspace/shared/utils/empty.util';
import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import { map } from 'rxjs/operators';

import { SetThemeAction } from './theme.actions';

@Injectable()
export class ThemeEffects {
  /**
   * Initialize with a theme that doesn't depend on the route.
   */
  initTheme$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map(() => {
        const defaultThemeConfig = getDefaultThemeConfig(this.appConfig);
        if (hasValue(defaultThemeConfig)) {
          return new SetThemeAction(defaultThemeConfig.name);
        } else {
          return new SetThemeAction(BASE_THEME_NAME);
        }
      }),
    ),
  );

  constructor(
    protected actions$: Actions,
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
  ) {
  }
}
