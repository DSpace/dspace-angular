import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NavbarToggleAction } from '../navbar/navbar.actions';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';

@Component({
  selector: 'ds-header',
  styleUrls: ['header.component.scss'],
  templateUrl: 'header.component.html',
})
export class HeaderComponent {
  /**
   * Whether user is authenticated.
   * @type {Observable<string>}
   */
  public isAuthenticated: Observable<boolean>;
  public showAuth = false;

  constructor(
    private store: Store<AppState>,
  ) {
  }

  public toggle(): void {
    this.store.dispatch(new NavbarToggleAction());
  }
}
