import { Observable, of as observableOf } from 'rxjs';

const variables = {
  smMin: '576px,',
  mdMin: '768px,',
  lgMin: '992px',
  xlMin: '1200px',
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
}
