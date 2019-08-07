import {Component, Injector, OnDestroy, OnInit, ReflectiveInjector} from '@angular/core';
import {AuthState} from '../../../core/auth/auth.reducer';
import {Store} from '@ngrx/store';
import {DynamicTestComponent} from '../DynamicTestComponent/dynamic-test.component';
import {LogInComponent} from '../password/log-in.component';
import {DynamicShibbolethComponent} from '../shibboleth/dynamic-shibboleth.component';
import {getAuthenticationMethods} from '../../../core/auth/selectors';
import {map, tap} from 'rxjs/operators';
import {AppState} from '../../../app.reducer';
import {Observable} from 'rxjs';
import {DynamicLoginMethod} from './log-in-container.model';
import {AuthMethodConstants, AuthMethodModel} from '../../../core/auth/models/auth-method.model';
import {ShibbolethComponent} from '../../../+login-page/shibboleth/shibboleth.component';

@Component({
  selector: 'ds-log-in-container',
  templateUrl: './log-in-container.component.html',
  // styleUrls: ['./log-in.component.scss'],

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
        // {provide: 'sectionDataProvider', useFactory: () => (this.sectionData), deps: []},
        // {provide: 'submissionIdProvider', useFactory: () => (this.submissionId), deps: []},
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
       label: 'TestComponent',
       component: DynamicTestComponent
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
