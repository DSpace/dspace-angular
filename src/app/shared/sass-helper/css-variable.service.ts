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

@Injectable()
export class CSSVariableService {
  constructor(
    protected store: Store<AppState>) {
  }

  addCSSVariable(name: string, value: string) {
    this.store.dispatch(new AddCSSVariableAction(name, value));
  }

  getVariable(name: string) {
    return this.store.pipe(select(themeVariableByNameSelector(name)));
  }

  getAllVariables() {
    return this.store.pipe(select(themeVariablesSelector));
  }

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
