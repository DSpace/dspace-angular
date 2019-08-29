import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {DynamicShibbolethComponent} from './methods/shibboleth/dynamic-shibboleth.component';
import {getAuthenticationMethods} from '../../core/auth/selectors';
import {map} from 'rxjs/operators';
import {AppState} from '../../app.reducer';
import {Observable} from 'rxjs';
import {AuthMethodType} from '../../core/auth/models/auth-method.model';
import {DynamicLoginMethod} from './log-in.model';
import {LogInPasswordComponent} from './methods/password/log-in-password.component';

@Component({
  selector: 'ds-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss'],

})
export class LogInComponent implements OnDestroy, OnInit {

  public dynamicLoginMethods: Observable<DynamicLoginMethod[]>;
  /**
   * Injector to inject a section component with the @Input parameters
   * @type {Injector}
   */
  public objectInjector: Injector;
  private shibbolethUrl: string;

  /**
   * @constructor
   * @param {Store<State>} store
   * @param {Injector} injector
   */
  constructor(
    private store: Store<AppState>,
    private injector: Injector
  ) {
  }

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
              case AuthMethodType.Password:
                return new DynamicLoginMethod(authMethod.authMethodName, LogInPasswordComponent)
                break;
              case AuthMethodType.Shibboleth:
                this.shibbolethUrl = authMethod.location;
                // this.shibbolethUrl = 'https://fis.tiss.tuwien.ac.at/Shibboleth.sso/Login?target=https://fis.tiss.tuwien.ac.at/shibboleth';
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

  /**
   *  Lifecycle hook that is called when a directive, pipe or service is destroyed.
   * @method ngOnDestroy
   */
  public ngOnDestroy() {
    // console.log('ngOnDestroy() in LogInContainerComponent was called');
  }

}
