import { Inject, Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { CoreState } from '../core.reducers';
import { SetThemeAction } from './theme.actions';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../config';
import { Theme } from '../../../config/theme.inferface';
import { isNotEmpty } from '../../shared/empty.util';
import { asyncScheduler, defer, Observable, of as observableOf } from 'rxjs';

@Injectable()
export class ThemeEffects {

  // @Effect() setInitialTheme: Observable<Action> = defer(() => {
  //   console.log('set theme');
  //   const availableThemes: Theme[] = this.config.themes;
  //   if (isNotEmpty(availableThemes)) {
  //     return observableOf(new SetThemeAction(availableThemes[0]), asyncScheduler);
  //   }
  // });
  //
  // constructor(private actions: Actions, private store: Store<CoreState>, @Inject(GLOBAL_CONFIG) public config: GlobalConfig) {
  //   console.log("theme effects");
  // }
}
