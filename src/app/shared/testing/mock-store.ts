import { Action } from '@ngrx/store';
import { Observable ,  BehaviorSubject } from 'rxjs';

export class MockStore<T> extends BehaviorSubject<T> {

  constructor(private _initialState: T) {
    super(_initialState);
  }

  dispatch = (action: Action): void => {
    // console.info(action);
  };

  select = <R>(pathOrMapFn: any): Observable<T> => {
    return this.asObservable()
      .map((value) => pathOrMapFn.projector(value))
  };

  nextState(_newState: T) {
    this.next(_newState);
  }

}
