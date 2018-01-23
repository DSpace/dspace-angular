import { Injectable } from '@angular/core';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { TruncatablesState, TruncatableState } from './truncatable.reducer';
import { TruncatableToggleAction } from './truncatable.actions';
import { hasValue } from '../empty.util';

const truncatableStateSelector = (state: TruncatablesState) => state.truncatable;

@Injectable()
export class TruncatableService {

  constructor(private store: Store<TruncatablesState>) {
  }

  isCollapsed(id: string): Observable<boolean> {
    return this.store.select(truncatableByIdSelector(id))
      .map((object: TruncatableState) => {
      console.log(object);
        if (object) {
          return object.collapsed;
        } else {
          return false;
        }
      });
  }

  public toggle(id: string): void {
    this.store.dispatch(new TruncatableToggleAction(id));
  }
}

function truncatableByIdSelector(id: string): MemoizedSelector<TruncatablesState, TruncatableState> {
  return keySelector<TruncatableState>(id);
}

export function keySelector<T>(key: string): MemoizedSelector<TruncatablesState, T> {
  return createSelector(truncatableStateSelector, (state: TruncatableState) => {
    console.log(state, 'test');

    if (hasValue(state)) {
      return state[key];
    } else {
      return undefined;
    }
  });
}
