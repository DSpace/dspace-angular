import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import { renderAuthMethodFor } from '../authMethods-decorator';
import { AuthMethodType } from '../authMethods-type';
import { AuthMethodModel } from '../../../../core/auth/models/auth-method.model';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { CoreState } from '../../../../core/core.reducers';
import { StartShibbolethAuthenticationAction } from '../../../../core/auth/auth.actions';
import { Observable, of, Subscription } from 'rxjs';
import {
  getAuthenticationMethods,
  isAuthenticated,
  isAuthenticationLoading
} from '../../../../core/auth/selectors';
import { HttpClient } from '@angular/common/http';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../../../config';
import { ShibbConstants } from '../../../../+login-page/shibbolethTargetPage/const/shibbConstants';
import { tap } from 'rxjs/operators';

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

    // console.log('Injected authMethodModel', this.injectedAuthMethodModel);

    // set isAuthenticated
    this.isAuthenticated = this.store.pipe(select(isAuthenticated));

    // set loading
    this.loading = this.store.pipe(select(isAuthenticationLoading));

  }

  submit() {
    console.log('submit() was called');
    this.store.dispatch(new StartShibbolethAuthenticationAction(this.authMethodModel));
    // e.g. host = 'fis.tiss.tuwien.ac.at';
    // https://host/Shibboleth.sso/Login?target=https://host/shibboleth
    // https://fis.tiss.tuwien.ac.at/Shibboleth.sso/Login?target=https://fis.tiss.tuwien.ac.at/shibboleth';
    window.location.href = this.injectedAuthMethodModel.location;
  }

}
