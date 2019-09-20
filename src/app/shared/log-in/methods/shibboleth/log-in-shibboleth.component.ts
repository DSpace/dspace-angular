import {
  Component,
  Inject,
  Input,
  OnInit,
} from '@angular/core';
import { renderAuthMethodFor } from '../authMethods-decorator';
import { AuthMethodType } from '../authMethods-type';
import { AuthMethodModel } from '../../../../core/auth/models/auth-method.model';
import { FormBuilder } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { CoreState } from '../../../../core/core.reducers';
import { StartShibbolethAuthenticationAction } from '../../../../core/auth/auth.actions';
import { Observable } from 'rxjs';
import {
  isAuthenticated,
  isAuthenticationLoading
} from '../../../../core/auth/selectors';

@Component({
  selector: 'ds-log-in-shibboleth',
  templateUrl: './log-in-shibboleth.component.html',
  styleUrls: ['./log-in-shibboleth.component.scss'],

})
@renderAuthMethodFor(AuthMethodType.Shibboleth)
export class LogInShibbolethComponent implements OnInit {

  @Input() authMethodModel: AuthMethodModel;

  /**
   * True if the authentication is loading.
   * @type {boolean}
   */
  public loading: Observable<boolean>;

  /**
   * Whether user is authenticated.
   * @type {Observable<string>}
   */
  public isAuthenticated: Observable<boolean>;

  /**
   * @constructor
   */
  constructor(@Inject('authMethodModelProvider') public injectedAuthMethodModel: AuthMethodModel,
              private formBuilder: FormBuilder,
              private store: Store<CoreState>) {
    this.authMethodModel = injectedAuthMethodModel;
  }

  ngOnInit(): void {
    // set isAuthenticated
    this.isAuthenticated = this.store.pipe(select(isAuthenticated));

    // set loading
    this.loading = this.store.pipe(select(isAuthenticationLoading));
  }

  submit() {
    this.store.dispatch(new StartShibbolethAuthenticationAction(this.authMethodModel));
    // https://host/Shibboleth.sso/Login?target=https://host/shibboleth
    window.location.href = this.injectedAuthMethodModel.location;
  }

}
