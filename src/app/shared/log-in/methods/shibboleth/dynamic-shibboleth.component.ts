import { Component, EventEmitter, Inject, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { renderAuthMethodFor } from '../authMethods-decorator';
import { AuthMethodType } from '../authMethods-type';
import { AuthMethodModel } from '../../../../core/auth/models/auth-method.model';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { CoreState } from '../../../../core/core.reducers';
import { StartShibbolethAuthenticationAction } from '../../../../core/auth/auth.actions';
import { Observable } from 'rxjs';
import { isAuthenticated, isAuthenticationLoading } from '../../../../core/auth/selectors';
import { HttpClient } from '@angular/common/http';
import { GLOBAL_CONFIG, GlobalConfig } from '../../../../../config';

@Component({
  selector: 'ds-dynamic-shibboleth',
  templateUrl: './dynamic-shibboleth.component.html',
  styleUrls: ['./dynamic-shibboleth.component.scss'],

})
@renderAuthMethodFor(AuthMethodType.Shibboleth)
export class DynamicShibbolethComponent implements OnInit {

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
   * The authentication form.
   * @type {FormGroup}
   */
  public shibbForm: FormGroup;

  private host: string;

  // public shibbButton: FormControl;

  /**
   * @constructor
   */
  constructor(@Inject('authMethodModelProvider') public injectedAuthMethodModel: AuthMethodModel,
              @Inject(GLOBAL_CONFIG) private envConfig: GlobalConfig,
              private formBuilder: FormBuilder,
              private store: Store<CoreState>) {
    this.authMethodModel = injectedAuthMethodModel;
  }

  ngOnInit(): void {
    console.log('conf: ',this.envConfig.rest.host);

    this.host = this.envConfig.rest.host;

    // console.log('injectedAuthMethodModel', this.injectedAuthMethodModel);
    // set formGroup
    this.shibbForm = this.formBuilder.group({
      shibbButton: [''],
    });

    // this.shibbButton = new FormControl('');

    // set isAuthenticated
    this.isAuthenticated = this.store.pipe(select(isAuthenticated));

    // set loading
    this.loading = this.store.pipe(select(isAuthenticationLoading));

  }

  submit() {
    console.log('submit() was called');
    this.store.dispatch(new StartShibbolethAuthenticationAction(this.authMethodModel));
    this.host = 'fis.tiss.tuwien.ac.at';
    // https://dspace.hostname/Shibboleth.sso/Login?target=https://dspace.hostname/shibboleth
    window.location.href = 'https://' + this.host + '/Shibboleth.sso/Login?target=https://' + this.host + '/shibboleth';
  }
}
