import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { HeaderState } from './header.reducer';
import { HeaderToggleAction } from './header.actions';

@Component({
  selector: 'ds-header',
  styleUrls: ['header.component.scss'],
  templateUrl: 'header.component.html'
})
export class HeaderComponent implements OnInit {
  public isNavBarCollapsed: Observable<boolean>;

  constructor(
    private store: Store<HeaderState>
  ) {
  }

  ngOnInit(): void {
    this.isNavBarCollapsed = this.store.select('header')
      // unwrap navCollapsed
      .map(({ navCollapsed }: HeaderState) => navCollapsed);
  }

  public toggle(): void {
    this.store.dispatch(new HeaderToggleAction());
  }

}
