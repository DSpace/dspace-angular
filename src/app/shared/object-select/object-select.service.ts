import { Injectable } from '@angular/core';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { ObjectSelectionsState, ObjectSelectionState } from './object-select.reducer';
import {
  ObjectSelectionDeselectAction,
  ObjectSelectionInitialDeselectAction,
  ObjectSelectionInitialSelectAction, ObjectSelectionResetAction,
  ObjectSelectionSelectAction, ObjectSelectionSwitchAction
} from './object-select.actions';
import { Observable } from 'rxjs/Observable';
import { hasValue } from '../empty.util';
import { map } from 'rxjs/operators';
import { AppState } from '../../app.reducer';

const selectionStateSelector = (state: ObjectSelectionsState) => state.objectSelection;
const objectSelectionsStateSelector = (state: AppState) => state.objectSelection;

/**
 * Service that takes care of selecting and deselecting objects
 */
@Injectable()
export class ObjectSelectService {

  constructor(
    private store: Store<ObjectSelectionsState>,
    private appStore: Store<AppState>
  ) {
  }

  /**
   * Request the current selection of a given object
   * @param {string} id The UUID of the object
   * @returns {Observable<boolean>} Emits the current selection state of the given object, if it's unavailable, return false
   */
  getSelected(id: string): Observable<boolean> {
    return this.store.select(selectionByIdSelector(id)).pipe(
      map((object: ObjectSelectionState) => {
        if (object) {
          return object.checked;
        } else {
          return false;
        }
      })
    );
  }

  /**
   * Request the current selection of a given object
   * @param {string} id The UUID of the object
   * @returns {Observable<boolean>} Emits the current selection state of the given object, if it's unavailable, return false
   */
  getAllSelected(): Observable<string[]> {
    return this.appStore.select(objectSelectionsStateSelector).pipe(
      map((state: ObjectSelectionsState) => Object.keys(state).filter((key) => state[key].checked))
    );
  }

  /**
   * Dispatches an initial select action to the store for a given object
   * @param {string} id The UUID of the object to select
   */
  public initialSelect(id: string): void {
    this.store.dispatch(new ObjectSelectionInitialSelectAction(id));
  }

  /**
   * Dispatches an initial deselect action to the store for a given object
   * @param {string} id The UUID of the object to deselect
   */
  public initialDeselect(id: string): void {
    this.store.dispatch(new ObjectSelectionInitialDeselectAction(id));
  }

  /**
   * Dispatches a select action to the store for a given object
   * @param {string} id The UUID of the object to select
   */
  public select(id: string): void {
    this.store.dispatch(new ObjectSelectionSelectAction(id));
  }

  /**
   * Dispatches a deselect action to the store for a given object
   * @param {string} id The UUID of the object to deselect
   */
  public deselect(id: string): void {
    this.store.dispatch(new ObjectSelectionDeselectAction(id));
  }

  /**
   * Dispatches a switch action to the store for a given object
   * @param {string} id The UUID of the object to select
   */
  public switch(id: string): void {
    this.store.dispatch(new ObjectSelectionSwitchAction(id));
  }

  /**
   * Dispatches a reset action to the store for all objects
   */
  public reset(): void {
    this.store.dispatch(new ObjectSelectionResetAction(null));
  }

}

function selectionByIdSelector(id: string): MemoizedSelector<ObjectSelectionsState, ObjectSelectionState> {
  return keySelector<ObjectSelectionState>(id);
}

export function keySelector<T>(key: string): MemoizedSelector<ObjectSelectionsState, T> {
  return createSelector(selectionStateSelector, (state: ObjectSelectionState) => {
    if (hasValue(state)) {
      return state[key];
    } else {
      return undefined;
    }
  });
}
