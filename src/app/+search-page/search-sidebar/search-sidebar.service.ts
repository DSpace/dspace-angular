import { combineLatest as observableCombineLatest, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { SearchSidebarState } from './search-sidebar.reducer';
import { createSelector, select, Store } from '@ngrx/store';
import { SearchSidebarCollapseAction, SearchSidebarExpandAction } from './search-sidebar.actions';
import { AppState } from '../../app.reducer';
import { HostWindowService } from '../../shared/host-window.service';
import { map } from 'rxjs/operators';

const sidebarStateSelector = (state: AppState) => state.searchSidebar;
const sidebarCollapsedSelector = createSelector(sidebarStateSelector, (sidebar: SearchSidebarState) => sidebar.sidebarCollapsed);

/**
 * Service that performs all actions that have to do with the search sidebar
 */
@Injectable()
export class SearchSidebarService {
  /**
   * Emits true is the current screen size is mobile
   */
  private isXsOrSm$: Observable<boolean>;

  /**
   * Emits true is the sidebar's state in the store is currently collapsed
   */
  private isCollapsedInStore: Observable<boolean>;

  constructor(private store: Store<AppState>, private windowService: HostWindowService) {
    this.isXsOrSm$ = this.windowService.isXsOrSm();
    this.isCollapsedInStore = this.store.pipe(select(sidebarCollapsedSelector));
  }

  /**
   * Checks if the sidebar should currently be collapsed
   * @returns {Observable<boolean>} Emits true if the user's screen size is mobile or when the state in the store is currently collapsed
   */
  get isCollapsed(): Observable<boolean> {
    return observableCombineLatest(
      this.isXsOrSm$,
      this.isCollapsedInStore
    ).pipe(
      map(([mobile, store]) => mobile ? store : true)
    );
  }

  /**
   * Dispatches a collapse action to the store
   */
  public collapse(): void {
    this.store.dispatch(new SearchSidebarCollapseAction());
  }

  /**
   * Dispatches an expand action to the store
   */
  public expand(): void {
    this.store.dispatch(new SearchSidebarExpandAction());
  }
}
