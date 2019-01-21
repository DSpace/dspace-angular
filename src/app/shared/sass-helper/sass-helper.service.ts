import { Inject, Injectable } from '@angular/core';
import { AppState, keySelector } from '../../app.reducer';
import { MemoizedSelector, select, Store } from '@ngrx/store';
import { GLOBAL_CONFIG } from '../../../config';
import { GlobalConfig } from '../../../config/global-config.interface';
import { AddCSSVariableAction } from './sass-helper.actions';

@Injectable()
export class CSSVariableService {
  constructor(
    protected store: Store<AppState>,
    @Inject(GLOBAL_CONFIG) protected EnvConfig: GlobalConfig) {
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
