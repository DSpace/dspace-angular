import { Component, OnInit } from '@angular/core';
import { createSelector, select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RouterReducerState } from '@ngrx/router-store';

import { HeaderState } from './header.reducer';
import { HeaderToggleAction } from './header.actions';
import { AppState } from '../app.reducer';
import { HostWindowService } from '../shared/host-window.service';

const headerStateSelector = (state: AppState) => state.header;
const navCollapsedSelector = createSelector(headerStateSelector, (header: HeaderState) => header.navCollapsed);

@Component({
  selector: 'ds-header',
  styleUrls: ['header.component.scss'],
  templateUrl: 'header.component.html',
})
export class HeaderComponent implements OnInit {
  /**
   * Whether user is authenticated.
   * @type {Observable<string>}
   */
  public isAuthenticated: Observable<boolean>;
  public isNavBarCollapsed: Observable<boolean>;
  public showAuth = false;

  constructor(
    private store: Store<AppState>,
    private windowService: HostWindowService
  ) {
  }

  ngOnInit(): void {
    // set loading
    this.isNavBarCollapsed = this.store.pipe(select(navCollapsedSelector));
  }

  public toggle(): void {
    this.store.dispatch(new HeaderToggleAction());
  }

}
