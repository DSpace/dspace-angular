import { Component, OnInit } from '@angular/core';
import {GetJWTafterShibbLoginAction} from '../../core/auth/auth.actions';
import {Store} from '@ngrx/store';
import {CoreState} from '../../core/core.reducers';
import {Observable, of} from 'rxjs';

@Component({
  selector: 'ds-shibboleth-page',
  templateUrl: './shibboleth.component.html',
  styleUrls: ['./shibboleth.component.scss']
})
export class ShibbolethComponent implements OnInit {

  /**
   * True if the shibboleth authentication is loading.
   * @type {boolean}
   */
  public loading: Observable<boolean>;

  ngOnInit() {
    this.loading = of(true);
    this.store.dispatch(new GetJWTafterShibbLoginAction());
  }

  constructor( private store: Store<CoreState>,) { }

}
