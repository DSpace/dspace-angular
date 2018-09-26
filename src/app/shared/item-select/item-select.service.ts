import { Injectable } from '@angular/core';
import { createSelector, MemoizedSelector, Store } from '@ngrx/store';
import { ItemSelectionsState, ItemSelectionState } from './item-select.reducer';
import {
  ItemSelectionDeselectAction,
  ItemSelectionInitialDeselectAction,
  ItemSelectionInitialSelectAction, ItemSelectionResetAction,
  ItemSelectionSelectAction, ItemSelectionSwitchAction
} from './item-select.actions';
import { Observable } from 'rxjs/Observable';
import { hasValue } from '../empty.util';

const selectionStateSelector = (state: ItemSelectionsState) => state.selectionItem;

/**
 * Service that takes care of selecting and deselecting items
 */
@Injectable()
export class ItemSelectService {

  constructor(private store: Store<ItemSelectionsState>) {
  }

  /**
   * Request the current selection of a given item
   * @param {string} id The UUID of the item
   * @returns {Observable<boolean>} Emits the current selection state of the given item, if it's unavailable, return false
   */
  getSelected(id: string): Observable<boolean> {
    return this.store.select(selectionByIdSelector(id))
      .map((object: ItemSelectionState) => {
        if (object) {
          return object.checked;
        } else {
          return false;
        }
      });
  }

  /**
   * Dispatches an initial select action to the store for a given item
   * @param {string} id The UUID of the item to select
   */
  public initialSelect(id: string): void {
    this.store.dispatch(new ItemSelectionInitialSelectAction(id));
  }

  /**
   * Dispatches an initial deselect action to the store for a given item
   * @param {string} id The UUID of the item to deselect
   */
  public initialDeselect(id: string): void {
    this.store.dispatch(new ItemSelectionInitialDeselectAction(id));
  }

  /**
   * Dispatches a select action to the store for a given item
   * @param {string} id The UUID of the item to select
   */
  public select(id: string): void {
    this.store.dispatch(new ItemSelectionSelectAction(id));
  }

  /**
   * Dispatches a deselect action to the store for a given item
   * @param {string} id The UUID of the item to deselect
   */
  public deselect(id: string): void {
    this.store.dispatch(new ItemSelectionDeselectAction(id));
  }

  /**
   * Dispatches a switch action to the store for a given item
   * @param {string} id The UUID of the item to select
   */
  public switch(id: string): void {
    this.store.dispatch(new ItemSelectionSwitchAction(id));
  }

  /**
   * Dispatches a reset action to the store for all items
   */
  public reset(): void {
    this.store.dispatch(new ItemSelectionResetAction(null));
  }

}

function selectionByIdSelector(id: string): MemoizedSelector<ItemSelectionsState, ItemSelectionState> {
  return keySelector<ItemSelectionState>(id);
}

export function keySelector<T>(key: string): MemoizedSelector<ItemSelectionsState, T> {
  return createSelector(selectionStateSelector, (state: ItemSelectionState) => {
    if (hasValue(state)) {
      return state[key];
    } else {
      return undefined;
    }
  });
}
