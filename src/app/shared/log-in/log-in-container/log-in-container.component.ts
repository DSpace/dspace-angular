import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {LogInComponent} from '../password/log-in.component';
import {DynamicShibbolethComponent} from '../shibboleth/dynamic-shibboleth.component';
import {getAuthenticationMethods} from '../../../core/auth/selectors';
import {map} from 'rxjs/operators';
import {AppState} from '../../../app.reducer';
import {Observable} from 'rxjs';
import {DynamicLoginMethod} from './log-in-container.model';
import {AuthMethodConstants} from '../../../core/auth/models/auth-method.model';
import {DynamicLdapComponent} from '../ldap/dynamic-ldap.component';
import {DynamicX509Component} from '../x509/dynamic-x509.component';
import {DynamicIpComponent} from '../ip/dynamic-ip.component';

@Component({
  selector: 'ds-log-in-container',
  templateUrl: './log-in-container.component.html',
  styleUrls: ['./log-in-container.component.scss'],

})
export class LogInContainerComponent implements OnDestroy, OnInit {

  private dynamicLoginMethods: Observable<DynamicLoginMethod[]>;
  private authInfoInjector: Injector;
  /**
   * Injector to inject a section component with the @Input parameters
   * @type {Injector}
   */
  public objectInjector: Injector;
  private shibbolethUrl: string;

  /**
   * @constructor
   * @param {AuthService} authService
   * @param {FormBuilder} formBuilder
   * @param {Store<State>} store
   */
  constructor(
    private store: Store<AppState>,
    private injector: Injector

  ) {}

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   * @method ngOnInit
   */
  public ngOnInit() {

    this.objectInjector = Injector.create({
      providers: [
        {provide: 'shibbolethUrlProvider', useFactory: () => (this.shibbolethUrl), deps: []},
        // if other authentication methods need further data to work add a provider here e.g
        // {provide: 'otherDataProvider', useFactory: () => (this.otherData), deps: []},
      ],
      parent: this.injector
    });

    this.dynamicLoginMethods = this.store.select(getAuthenticationMethods).pipe(
      map(((authMethods) => authMethods.map((authMethod) => {
            switch (authMethod.authMethodConstant) {
              case AuthMethodConstants.PASSWORD:
                return new DynamicLoginMethod(authMethod.authMethodName, LogInComponent)
                break;
              case AuthMethodConstants.SHIBBOLETH:
                // this.shibbolethUrl = authMethod.location;
                this.shibbolethUrl = 'https://fis.tiss.tuwien.ac.at/Shibboleth.sso/Login?target=https://fis.tiss.tuwien.ac.at/shibboleth';
                return new DynamicLoginMethod(authMethod.authMethodName, DynamicShibbolethComponent, authMethod.location)
                break;
              case AuthMethodConstants.LDAP:
                return new DynamicLoginMethod(authMethod.authMethodName, DynamicLdapComponent)
                break;
              case AuthMethodConstants.IP:
                return new DynamicLoginMethod(authMethod.authMethodName, DynamicIpComponent)
                break;
              case AuthMethodConstants.X509:
                return new DynamicLoginMethod(authMethod.authMethodName, DynamicX509Component)
                break;
              default:
                break;
            }
          }
          )
        )
      )
    );

  }

  /* this.dynamicLoginMethods = this.dynamicLoginMethods = [
     {
       label: 'PasswordComponent',
       component: LogInComponent
     },
     {
       label: 'ShibbolethComponent',
       component: DynamicShibbolethComponent
     },

   ];
 }*/

  /**
   *  Lifecycle hook that is called when a directive, pipe or service is destroyed.
   * @method ngOnDestroy
   */
  public ngOnDestroy() {
    console.log('ngOnDestroy() in LogInContainerComponent was called');
  }

}
