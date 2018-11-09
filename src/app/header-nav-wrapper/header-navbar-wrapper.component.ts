import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { createSelector, Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { Observable } from 'rxjs/Observable';
import { NavbarState } from '../navbar/navbar.reducer';
import { Subscription } from 'rxjs/Subscription';
import { hasValue } from '../shared/empty.util';

const navbarStateSelector = (state: AppState) => state.navbar;
const navCollapsedSelector = createSelector(navbarStateSelector, (navbar: NavbarState) => navbar.navCollapsed);
@Component({
  selector: 'ds-header-navbar-wrapper',
  styleUrls: ['header-navbar-wrapper.component.scss'],
  templateUrl: 'header-navbar-wrapper.component.html',
})
export class HeaderNavbarWrapperComponent implements OnInit, OnDestroy {
  @HostBinding('class.open') isOpen = false;
  private sub: Subscription;
  public isNavBarCollapsed: Observable<boolean>;

  constructor(
    private store: Store<AppState>
  ) {
  }

  ngOnInit(): void {
    this.isNavBarCollapsed = this.store.select(navCollapsedSelector);
    this.sub = this.isNavBarCollapsed.subscribe((isCollapsed) => this.isOpen = !isCollapsed)
  }

  ngOnDestroy() {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
  }
}
