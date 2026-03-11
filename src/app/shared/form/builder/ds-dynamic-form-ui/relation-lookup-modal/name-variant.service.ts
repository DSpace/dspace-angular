import { Injectable } from '@angular/core';
import {
  MemoizedSelector,
  select,
  Store,
} from '@ngrx/store';
import { Observable } from 'rxjs';

import {
  AppState,
  keySelector,
} from '../../../../../app.reducer';
import {
  RemoveNameVariantAction,
  SetNameVariantAction,
} from './name-variant.actions';
import { NameVariantListState } from './name-variant.reducer';

const relationshipListsStateSelector = (state: AppState) => state.relationshipLists;

const relationshipListStateSelector = (listID: string): MemoizedSelector<AppState, NameVariantListState> => {
  return keySelector<NameVariantListState>(listID, relationshipListsStateSelector);
};

const relationshipStateSelector = (listID: string, itemID: string): MemoizedSelector<AppState, string> => {
  return keySelector<string>(itemID, relationshipListStateSelector(listID));
};


/**
 * The service handling all relationship requests
 */
@Injectable({ providedIn: 'root' })
export class NameVariantService {

  constructor(protected store: Store<AppState>) {
  }

  /**
   * Method to set the name variant for specific list and item
   * @param listID The list for which to save the name variant
   * @param itemID The item ID for which to save the name variant
   * @param nameVariant The name variant to save
   */
  public setNameVariant(listID: string, itemID: string, nameVariant: string) {
    this.store.dispatch(new SetNameVariantAction(listID, itemID, nameVariant));
  }

  /**
   * Method to retrieve the name variant for a specific list and item
   * @param listID The list for which to retrieve the name variant
   * @param itemID The item ID for which to retrieve the name variant
   */
  public getNameVariant(listID: string, itemID: string): Observable<string> {
    return this.store.pipe(
      select(relationshipStateSelector(listID, itemID)),
    );
  }

  /**
   * Method to remove the name variant for specific list and item
   * @param listID The list for which to remove the name variant
   * @param itemID The item ID for which to remove the name variant
   */
  public removeNameVariant(listID: string, itemID: string) {
    this.store.dispatch(new RemoveNameVariantAction(listID, itemID));
  }

  /**
   * Method to retrieve all name variants for a single list
   * @param listID The id of the list
   */
  public getNameVariantsByListID(listID: string) {
    return this.store.pipe(select(relationshipListStateSelector(listID)));
  }

}
