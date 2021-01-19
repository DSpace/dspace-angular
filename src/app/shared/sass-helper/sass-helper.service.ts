import { Injectable } from '@angular/core';
import { AppState, keySelector } from '../../app.reducer';
import { MemoizedSelector, select, Store } from '@ngrx/store';
import { AddCSSVariableAction } from './sass-helper.actions';

@Injectable()
export class CSSVariableService {
  constructor(
    protected store: Store<AppState>) {
  }

  addCSSVariable(name: string, value: string) {
    this.store.dispatch(new AddCSSVariableAction(name, value));
  }

  getVariable(name: string) {
    return this.store.pipe(select(themeVariableByNameSelector(name)));
  }

  getAllVariables() {
    return this.store.pipe(select(themeVariablesSelector));
  }

}

const themeVariablesSelector = (state: AppState) => state.cssVariables;

const themeVariableByNameSelector = (name: string): MemoizedSelector<AppState, string> => {
  return keySelector<string>(name, themeVariablesSelector);
};
