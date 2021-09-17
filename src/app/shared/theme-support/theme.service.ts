import { Injectable, Inject } from '@angular/core';
import { Store, createFeatureSelector, createSelector, select } from '@ngrx/store';
import { Observable } from 'rxjs/internal/Observable';
import { ThemeState } from './theme.reducer';
import { SetThemeAction } from './theme.actions';
import { take } from 'rxjs/operators';
import { hasValue } from '../empty.util';
import { ThemeConfig } from '../../../config/theme.model';
import { environment } from '../../../environments/environment';
import {
  GET_THEME_CONFIG_FOR_FACTORY,
  getThemeConfigFor
} from '../object-collection/shared/listable-object/listable-object.decorator';

export const themeStateSelector = createFeatureSelector<ThemeState>('theme');

export const currentThemeSelector = createSelector(
  themeStateSelector,
  (state: ThemeState): string => hasValue(state) ? state.currentTheme : undefined
);

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  constructor(
    private store: Store<ThemeState>,
    @Inject(GET_THEME_CONFIG_FOR_FACTORY) private gtcf: (str) => ThemeConfig
  ) {
  }

  setTheme(newName: string) {
    this.store.dispatch(new SetThemeAction(newName));
  }

  getThemeName(): string {
    let currentTheme: string;
    this.store.pipe(
      select(currentThemeSelector),
      take(1)
    ).subscribe((name: string) =>
      currentTheme = name
    );
    return currentTheme;
  }

  getThemeName$(): Observable<string> {
    return this.store.pipe(
      select(currentThemeSelector)
    );
  }

  /**
   * Searches for a ThemeConfig by its name;
   */
  getThemeConfigFor(themeName: string): ThemeConfig {
    return this.gtcf(themeName);
  }
}
