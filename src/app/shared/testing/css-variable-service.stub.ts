import {
  Observable,
  of as observableOf,
} from 'rxjs';

import { KeyValuePair } from '../key-value-pair.model';

const variables = {
  '--bs-sm': '576px,',
  '--bs-md': '768px,',
  '--bs-lg': '992px',
  '--bs-xl': '1200px',
} as any;

export class CSSVariableServiceStub {
  getVariable(name: string): Observable<string> {
    return observableOf('500px');
  }

  getAllVariables(name: string): Observable<string> {
    return observableOf(variables);
  }

  addCSSVariable(name: string, value: string): void {
    /**/
  }

  addCSSVariables(variablesToAdd: KeyValuePair<string, string>[]): void {
    /**/
  }

  clearCSSVariables(): void {
    /**/
  }

  getCSSVariablesFromStylesheets(document: Document): void {
    /**/
  }
}
