import { Component, OnInit } from '@angular/core';
import { createSelector, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { HeaderState } from './header.reducer';
import { HeaderToggleAction } from './header.actions';
import { AppState } from '../app.reducer';

const headerStateSelector = (state: AppState) => state.header;
const navCollapsedSelector = createSelector(headerStateSelector, (header: HeaderState) => header.navCollapsed);

@Component({
  selector: 'ds-header',
  styleUrls: ['header.component.scss'],
  templateUrl: 'header.component.html'
})
export class HeaderComponent implements OnInit {
  public isNavBarCollapsed: Observable<boolean>;

  constructor(
    private store: Store<AppState>
  ) {
  }

  ngOnInit(): void {
    this.isNavBarCollapsed = this.store.select(navCollapsedSelector);
  }

  public toggle(): void {
    this.store.dispatch(new HeaderToggleAction());
  }

}
