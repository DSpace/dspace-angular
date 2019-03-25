import { createSelector, MemoizedSelector, select, Store } from '@ngrx/store';
import { coreSelector, CoreState } from '../core.reducers';
import { Inject, Injectable } from '@angular/core';
import { Theme } from '../../../config/theme.inferface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ThemeState } from './theme.reducer';
import { SetThemeAction } from './theme.actions';

function themeStateSelector(): MemoizedSelector<CoreState, ThemeState> {
  return createSelector(coreSelector, (state: CoreState) => state['theme']);
}

/**
 * Service that dispatches to and reads from the Theme state in the store
 */
@Injectable()
export class ThemeService {
  constructor(private store: Store<CoreState>) {

  }

  public getCurrentTheme(): Observable<Theme> {
    return this.store.pipe(
      select(themeStateSelector()),
      map((state: ThemeState) => state.theme)
    );
  }

  public setCurrentTheme(theme: Theme): void {
    return this.store.dispatch(new SetThemeAction(theme));
  }
}