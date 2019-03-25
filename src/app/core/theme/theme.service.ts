import { createSelector, MemoizedSelector, select, Store } from '@ngrx/store';
import { coreSelector, CoreState } from '../core.reducers';
import { Inject, Injectable } from '@angular/core';
import { Theme } from '../../../config/theme.inferface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ThemeState } from './theme.reducer';
import { SetThemeAction } from './theme.actions';
import { isNotEmpty } from '../../shared/empty.util';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../config';

function themeStateSelector(): MemoizedSelector<CoreState, ThemeState> {
  return createSelector(coreSelector, (state: CoreState) => state.theme);
}

/**
 * Service that dispatches to and reads from the Theme state in the store
 */
@Injectable()
export class ThemeService {
  /**
   * Sets the initial theme read from configuration
   * @param store The current store for the core state
   * @param config The global configuration
   */
  constructor(private store: Store<CoreState>, @Inject(GLOBAL_CONFIG) public config: GlobalConfig) {
    const availableThemes: Theme[] = this.config.themes;
    if (isNotEmpty(availableThemes)) {
      this.setCurrentTheme(availableThemes[0]);
    }
  }

  /**
   * Returns the current theme from the store
   */
  public getCurrentTheme(): Observable<Theme> {
    return this.store.pipe(
      select(themeStateSelector()),
      map((state: ThemeState) => state.theme)
    );
  }

  /**
   * Sets the current theme in the store
   * @param theme The new theme
   */
  public setCurrentTheme(theme: Theme): void {
    return this.store.dispatch(new SetThemeAction(theme));
  }
}
