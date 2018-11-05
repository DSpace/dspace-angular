import { Component, OnInit } from '@angular/core';
import { createSelector, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { NavbarState } from './navbar.reducer';
import { NavbarToggleAction } from './navbar.actions';
import { AppState } from '../app.reducer';

const navbarStateSelector = (state: AppState) => state.navbar;
const navCollapsedSelector = createSelector(navbarStateSelector, (navbar: NavbarState) => navbar.navCollapsed);

@Component({
  selector: 'ds-navbar',
  styleUrls: ['navbar.component.scss'],
  templateUrl: 'navbar.component.html',
})
export class NavbarComponent implements OnInit {
  public isNavBarCollapsed: Observable<boolean>;

  constructor(
    private store: Store<AppState>,
  ) {
  }

  ngOnInit(): void {
    // set loading
    this.isNavBarCollapsed = this.store.select(navCollapsedSelector);
  }

  public toggle(): void {
    this.store.dispatch(new NavbarToggleAction());
  }

}
