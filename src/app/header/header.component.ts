import { Component, OnInit } from '@angular/core';
import { createSelector, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { HeaderState } from './header.reducer';
import { HeaderToggleAction } from './header.actions';
import { AppState } from '../app.reducer';
import { HostWindowService } from '../shared/host-window.service';
import { fadeInOut } from '../shared/animations/fade';

const headerStateSelector = (state: AppState) => state.header;
const navCollapsedSelector = createSelector(headerStateSelector, (header: HeaderState) => header.navCollapsed);

@Component({
  selector: 'ds-header',
  styleUrls: ['header.component.scss'],
  templateUrl: 'header.component.html',
  animations: [
    fadeInOut
  ]
})
export class HeaderComponent implements OnInit {
  public isNavBarCollapsed: Observable<boolean>;

  constructor(
    private store: Store<AppState>,
    private windowService: HostWindowService
  ) {
  }

  ngOnInit(): void {
    this.isNavBarCollapsed = this.store.select(navCollapsedSelector);
  }

  public toggle(): void {
    this.store.dispatch(new HeaderToggleAction());
  }

}
