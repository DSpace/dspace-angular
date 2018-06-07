import { Injectable } from '@angular/core';
import { SearchSidebarState } from './search-sidebar.reducer';
import { createSelector, Store } from '@ngrx/store';
import { SearchSidebarCollapseAction, SearchSidebarExpandAction } from './search-sidebar.actions';
import { Observable } from 'rxjs/Observable';
import { AppState } from '../../app.reducer';
import { HostWindowService } from '../../shared/host-window.service';

const sidebarStateSelector = (state: AppState) => state.searchSidebar;
const sidebarCollapsedSelector = createSelector(sidebarStateSelector, (sidebar: SearchSidebarState) => sidebar.sidebarCollapsed);

@Injectable()
export class SearchSidebarService {
  private isXsOrSm$: Observable<boolean>;
  private isCollapsdeInStored: Observable<boolean>;

  constructor(private store: Store<AppState>, private windowService: HostWindowService) {
    this.isXsOrSm$ = this.windowService.isXsOrSm();
    this.isCollapsdeInStored = this.store.select(sidebarCollapsedSelector);
  }

  get isCollapsed(): Observable<boolean> {
    return Observable.combineLatest(
      this.isXsOrSm$,
      this.isCollapsdeInStored,
      (mobile, store) => mobile ? store : true);
  }

  public collapse(): void {
    this.store.dispatch(new SearchSidebarCollapseAction());
  }

  public expand(): void {
    this.store.dispatch(new SearchSidebarExpandAction());
  }
}
