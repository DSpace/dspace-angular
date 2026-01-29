import { type } from '@dspace/core/ngrx/type';
import { Action } from '@ngrx/store';

export const ThemeActionTypes = {
  SET: type('dspace/theme/SET'),
};

/**
 * An action to set the current theme
 */
export class SetThemeAction implements Action {
  type = ThemeActionTypes.SET;
  payload: {
    name: string
  };

  constructor(name: string) {
    this.payload = { name };
  }
}

export type ThemeAction = SetThemeAction;
