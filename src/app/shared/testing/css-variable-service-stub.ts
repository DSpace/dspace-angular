import { Observable } from 'rxjs/internal/Observable';
import { of as observableOf } from 'rxjs';

export class CSSVariableServiceStub {
  getVariable(name: string): Observable<string> {
    return observableOf('500px');
  }
}