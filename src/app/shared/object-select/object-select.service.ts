import { Injectable } from '@angular/core';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { ObjectSelectionListState, ObjectSelectionsState, ObjectSelectionState } from './object-select.reducer';
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
const objectSelectionsStateSelector = (state: ObjectSelectionListState) => state.objectSelection;
const objectSelectionListStateSelector = (state: AppState) => state.objectSelection;

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
   * Request the current selection of a given object in a given list
   * @param {string} key The key of the list where the selection resides in
   * @param {string} id The UUID of the object
   * @returns {Observable<boolean>} Emits the current selection state of the given object, if it's unavailable, return false
   */
  getSelected(key: string, id: string): Observable<boolean> {
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
   * Request the current selection of all objects
   * @returns {Observable<boolean>} Emits the current selection state of all objects
   */
  getAllSelected(): Observable<string[]> {
    return this.appStore.select(objectSelectionsStateSelector).pipe(
      map((state: ObjectSelectionsState) => Object.keys(state).filter((key) => state[key].checked))
    );
  }

  /**
   * Dispatches an initial select action to the store for a given object in a given list
   * @param {string} key The key of the list to select the object in
   * @param {string} id The UUID of the object to select
   */
  public initialSelect(key: string, id: string): void {
    this.store.dispatch(new ObjectSelectionInitialSelectAction(key, id));
  }

  /**
   * Dispatches an initial deselect action to the store for a given object in a given list
   * @param {string} key The key of the list to deselect the object in
   * @param {string} id The UUID of the object to deselect
   */
  public initialDeselect(key: string, id: string): void {
    this.store.dispatch(new ObjectSelectionInitialDeselectAction(key, id));
  }

  /**
   * Dispatches a select action to the store for a given object in a given list
   * @param {string} key The key of the list to select the object in
   * @param {string} id The UUID of the object to select
   */
  public select(key: string, id: string): void {
    this.store.dispatch(new ObjectSelectionSelectAction(key, id));
  }

  /**
   * Dispatches a deselect action to the store for a given object in a given list
   * @param {string} key The key of the list to deselect the object in
   * @param {string} id The UUID of the object to deselect
   */
  public deselect(key: string, id: string): void {
    this.store.dispatch(new ObjectSelectionDeselectAction(key, id));
  }

  /**
   * Dispatches a switch action to the store for a given object in a given list
   * @param {string} key The key of the list to select the object in
   * @param {string} id The UUID of the object to select
   */
  public switch(key: string, id: string): void {
    this.store.dispatch(new ObjectSelectionSwitchAction(key, id));
  }

  /**
   * Dispatches a reset action to the store for all objects (in a list)
   * @param {string} key The key of the list to clear all selections for
   */
  public reset(key?: string): void {
    this.store.dispatch(new ObjectSelectionResetAction(key, null));
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
