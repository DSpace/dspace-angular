import { Component, Injector, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthMethodModel } from '../../core/auth/models/auth-method.model';
import { Store } from '@ngrx/store';
import { AuthState } from '../../core/auth/auth.reducer';
import { getAuthenticationMethods } from '../../core/auth/selectors';

@Component({
  selector: 'ds-auth-methods',
  templateUrl: './authMethods.component.html',
  styleUrls: ['./authMethods.component.scss']
})
export class AuthMethodsComponent implements OnInit {
  /**
   * The authentication methods data
   * @type {AuthMethodModel[]}
   */
  @Input() authMethodData: Observable<AuthMethodModel[]>;

  constructor( private store: Store<AuthState>) {
  }

  ngOnInit(): void {
    this.authMethodData =  this.authMethodData = this.store.select(getAuthenticationMethods);
  }

}
