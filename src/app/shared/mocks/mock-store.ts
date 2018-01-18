import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

export function initMockStore<T>(selectResult: Observable<T>): Store<T> {
  return jasmine.createSpyObj('store', {
    dispatch: null,
    select: selectResult,
  });
}
