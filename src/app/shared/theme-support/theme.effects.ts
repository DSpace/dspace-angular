import { Injectable } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
  ROOT_EFFECTS_INIT,
} from '@ngrx/effects';
import { map } from 'rxjs/operators';

import { getDefaultThemeConfig } from '../../../config/config.util';
import { hasValue } from '../empty.util';
import { SetThemeAction } from './theme.actions';
import { BASE_THEME_NAME } from './theme.constants';
import { NoOpAction } from '../ngrx/no-op.action';

@Injectable()
export class ThemeEffects {
  /**
   * Initialize with a theme that doesn't depend on the route.
   */


  constructor(
    private actions$: Actions,
  ) {
  }
}
