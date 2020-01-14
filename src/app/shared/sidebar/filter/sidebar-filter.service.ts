import { Injectable } from '@angular/core';
import {
  FilterCollapseAction,
  FilterExpandAction, FilterInitializeAction,
  FilterToggleAction
} from './sidebar-filter.actions';
import { createSelector, MemoizedSelector, select, Store } from '@ngrx/store';
import { SidebarFiltersState, SidebarFilterState } from './sidebar-filter.reducer';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { hasValue } from '../../empty.util';

/**
 * Service that performs all actions that have to do with sidebar filters like collapsing or expanding them.
 */
@Injectable()
export class SidebarFilterService {

  constructor(private store: Store<SidebarFiltersState>) {
  }

  /**
   * Dispatches an initialize action to the store for a given filter
   * @param {string} filter The filter for which the action is dispatched
   * @param {boolean} expanded If the filter should be open from the start
   */
  public initializeFilter(filter: string, expanded: boolean): void {
    this.store.dispatch(new FilterInitializeAction(filter, expanded));
  }

  /**
   * Dispatches a collapse action to the store for a given filter
   * @param {string} filterName The filter for which the action is dispatched
   */
  public collapse(filterName: string): void {
    this.store.dispatch(new FilterCollapseAction(filterName));
  }

  /**
   * Dispatches an expand action to the store for a given filter
   * @param {string} filterName The filter for which the action is dispatched
   */
  public expand(filterName: string): void {
    this.store.dispatch(new FilterExpandAction(filterName));
  }

  /**
   * Dispatches a toggle action to the store for a given filter
   * @param {string} filterName The filter for which the action is dispatched
   */
  public toggle(filterName: string): void {
    this.store.dispatch(new FilterToggleAction(filterName));
  }

  /**
   * Checks if the state of a given filter is currently collapsed or not
   * @param {string} filterName The filtername for which the collapsed state is checked
   * @returns {Observable<boolean>} Emits the current collapsed state of the given filter, if it's unavailable, return false
   */
  isCollapsed(filterName: string): Observable<boolean> {
    return this.store.pipe(
      select(filterByNameSelector(filterName)),
      map((object: SidebarFilterState) => {
        if (object) {
          return object.filterCollapsed;
        } else {
          return false;
        }
      }),
      distinctUntilChanged()
    );
  }

}

const filterStateSelector = (state: SidebarFiltersState) => state.sidebarFilter;

function filterByNameSelector(name: string): MemoizedSelector<SidebarFiltersState, SidebarFilterState> {
  return keySelector<SidebarFilterState>(name);
}

export function keySelector<T>(key: string): MemoizedSelector<SidebarFiltersState, T> {
  return createSelector(filterStateSelector, (state: SidebarFilterState) => {
    if (hasValue(state)) {
      return state[key];
    } else {
      return undefined;
    }
  });
}
