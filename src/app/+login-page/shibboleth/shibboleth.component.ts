import { Component, OnInit } from '@angular/core';
import {GetJWTafterShibbLoginAction} from '../../core/auth/auth.actions';
import {Store} from '@ngrx/store';
import {CoreState} from '../../core/core.reducers';

@Component({
  selector: 'ds-shibboleth-page',
  templateUrl: './shibboleth.component.html',
  styleUrls: ['./shibboleth.component.scss']
})
export class ShibbolethComponent implements OnInit {

  constructor( private store: Store<CoreState>,) { }

  ngOnInit() {
    this.store.dispatch(new GetJWTafterShibbLoginAction());
  }

}
