import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class MockStore<T> extends BehaviorSubject<T> {

  constructor(private _initialState: T) {
    super(_initialState);
  }

  dispatch = (action: Action): void => {
    console.info();
  }

  select = <R>(pathOrMapFn: any): Observable<T> => {
    return Observable.of(this.getValue());
  }

  nextState(_newState: T) {
    this.next(_newState);
  }

}
