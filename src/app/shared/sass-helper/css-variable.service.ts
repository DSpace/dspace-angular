import { Injectable } from '@angular/core';
import { AppState, keySelector } from '../../app.reducer';
import { createSelector, MemoizedSelector, select, Store } from '@ngrx/store';
import { AddCSSVariableAction } from './css-variable.actions';
import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';
import { buildPaginatedList, PaginatedList } from '../../core/data/paginated-list.model';
import { Observable } from 'rxjs';
import { hasValue } from '../empty.util';
import { KeyValuePair } from '../key-value-pair.model';
import { PageInfo } from '../../core/shared/page-info.model';

/**
 * This service deals with adding and retrieving CSS variables to and from the store
 */
@Injectable()
export class CSSVariableService {
  constructor(
    protected store: Store<AppState>) {
  }

  /**
   * Adds a CSS variable to the store
   * @param name The name/key of the CSS variable
   * @param value The value of the CSS variable
   */
  addCSSVariable(name: string, value: string) {
    this.store.dispatch(new AddCSSVariableAction(name, value));
  }

  /**
   * Returns the value of a specific CSS key
   * @param name The name/key of the CSS value
   */
  getVariable(name: string) {
    return this.store.pipe(select(themeVariableByNameSelector(name)));
  }

  /**
   * Returns the CSSVariablesState of the store containing all variables
   */
  getAllVariables() {
    return this.store.pipe(select(themeVariablesSelector));
  }

  /**
   * Method to find CSS variables by their partially supplying their key. Case sensitive. Returns a paginated list of KeyValuePairs with CSS variables that match the query.
   * @param query The query to look for in the keys
   * @param paginationOptions The pagination options for the requested page
   */
  searchVariable(query: string, paginationOptions: PaginationComponentOptions): Observable<PaginatedList<KeyValuePair<string, string>>> {
    return this.store.pipe(select(themePaginatedVariablesByQuery(query, paginationOptions)));
  }
}

const themeVariablesSelector = (state: AppState) => state.cssVariables;

const themeVariableByNameSelector = (name: string): MemoizedSelector<AppState, string> => {
  return keySelector<string>(name, themeVariablesSelector);
};

// Split this up into two memoized selectors so the query search gets cached separately from the pagination,
// since the entire list has to be retrieved every time anyway
const themePaginatedVariablesByQuery = (query: string, pagination: PaginationComponentOptions): MemoizedSelector<AppState, PaginatedList<KeyValuePair<string, string>>> => {
  return createSelector(themeVariablesByQuery(query), (pairs) => {
    if (hasValue(pairs)) {
      const { currentPage, pageSize } = pagination;
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const pairsPage = pairs.slice(startIndex, endIndex);
      const totalPages = Math.ceil(pairs.length / pageSize);
      const pageInfo = new PageInfo({ currentPage, elementsPerPage: pageSize, totalElements: pairs.length, totalPages });
      return buildPaginatedList(pageInfo, pairsPage);
    } else {
      return undefined;
    }
  });
};

const themeVariablesByQuery = (query: string): MemoizedSelector<AppState, KeyValuePair<string, string>[]> => {
  return createSelector(themeVariablesSelector, (state) => {
    if (hasValue(state)) {
      return Object.keys(state)
        .filter((key: string) => key.includes(query))
        .map((key: string) => {
          return { key, value: state[key] };
        });
    } else {
      return undefined;
    }
  });
};
