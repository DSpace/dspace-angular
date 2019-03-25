/**
 * The list of ObjectUpdatesAction type definitions
 */
import { type } from '../../shared/ngrx/type';
import { Action } from '@ngrx/store';
import { Theme } from '../../../config/theme.inferface';

export const ThemeActionTypes = {
  SET: type('dspace/core/theme/SET'),
};

/* tslint:disable:max-classes-per-file */

/**
 * An ngrx action to set a the repository's current theme
 */
export class SetThemeAction implements Action {
  type = ThemeActionTypes.SET;
  payload: {
    theme: Theme
  };

  /**
   * Create a new SetThemeAction
   *
   * @param theme
   *    the theme configuration to change the current theme to
   */
  constructor(
    theme: Theme
  ) {
    this.payload = { theme };
  }
}

export type ThemeAction
  = SetThemeAction;
