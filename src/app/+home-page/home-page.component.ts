import { Component, OnInit } from '@angular/core';
import { isAuthenticated } from '../core/auth/selectors';
import { Observable } from 'rxjs/Observable';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'ds-home-page',
  styleUrls: ['./home-page.component.scss'],
  templateUrl: './home-page.component.html'
})
export class HomePageComponent implements OnInit {
  public isAuthenticated: Observable<boolean>;

  constructor(private store: Store<AppState>) {
  }

  ngOnInit() {
    // set loading
    this.isAuthenticated = this.store.select(isAuthenticated);
  }

}
