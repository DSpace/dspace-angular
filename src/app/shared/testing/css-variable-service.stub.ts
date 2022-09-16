import { Observable, of as observableOf } from 'rxjs';

const variables = {
  '--bs-sm-min': '576px,',
  '--bs-md-min': '768px,',
  '--bs-lg-min': '992px',
  '--bs-xl-min': '1200px',
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
