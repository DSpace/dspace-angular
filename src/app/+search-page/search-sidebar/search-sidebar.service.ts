import { Injectable } from '@angular/core';
import { SearchSidebarState } from './search-sidebar.reducer';
import { createSelector, Store } from '@ngrx/store';
import { SearchSidebarCollapseAction, SearchSidebarExpandAction } from './search-sidebar.actions';
import { Observable } from 'rxjs/Observable';
import { AppState } from '../../app.reducer';

const sidebarStateSelector = (state: AppState) => state.searchSidebar;
const sidebarCollapsedSelector = createSelector(sidebarStateSelector, (sidebar: SearchSidebarState) => sidebar.sidebarCollapsed);

@Injectable()
export class SearchSidebarService {
  constructor(private store: Store<AppState>) {
  }

  get isCollapsed(): Observable<boolean> {
    return this.store.select(sidebarCollapsedSelector);
  }

  public collapse(): void {
    this.store.dispatch(new SearchSidebarCollapseAction());
  }

  public expand(): void {
    this.store.dispatch(new SearchSidebarExpandAction());
  }
}
