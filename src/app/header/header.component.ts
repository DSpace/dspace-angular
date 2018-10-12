import { Component, OnInit } from '@angular/core';
import { createSelector, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RouterReducerState } from '@ngrx/router-store';

import { HeaderState } from './header.reducer';
import { HeaderToggleAction } from './header.actions';
import { AppState } from '../app.reducer';
import { HostWindowService } from '../shared/host-window.service';
import {TranslateService} from "@ngx-translate/core";

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
    private windowService: HostWindowService,
    public translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    // set loading
    this.isNavBarCollapsed = this.store.select(navCollapsedSelector);
  }

  public toggle(): void {
    this.store.dispatch(new HeaderToggleAction());
  }

}
