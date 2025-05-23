import { Injectable } from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
} from '@ngrx/effects';
import { map } from 'rxjs/operators';

import { StoreActionTypes } from '../../store.actions';
import { ReinitMenuAction } from './menu.actions';

@Injectable()
export class MenuEffects {

  /**
   * When the store is rehydrated in the browser, re-initialise the menus to ensure
   * the menus with functions are loaded correctly.
   */
  reinitDSOMenus = createEffect(() => this.actions$
    .pipe(ofType(StoreActionTypes.REHYDRATE),
      map(() => new ReinitMenuAction()),
    ));

  constructor(private actions$: Actions) {
  }

}
