import { Injectable } from '@angular/core';
import {
  select,
  Store,
} from '@ngrx/store';
import uniqBy from 'lodash/uniqBy';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppState } from '../../app.reducer';
import { AuthMethodTypeComponent } from '../../shared/log-in/methods/auth-methods.type';
import { rendersAuthMethodType } from '../../shared/log-in/methods/log-in.methods-decorator.utils';
import { AuthMethod } from './models/auth.method';
import { AuthMethodType } from './models/auth.method-type';
import { getAuthenticationMethods } from './selectors';

@Injectable({
  providedIn: 'root',
})
/**
 * Service responsible for managing and filtering authentication methods.
 * Provides methods to retrieve and process authentication methods from the application store.
 */
export class AuthMethodsService {
  constructor(protected store: Store<AppState>) {
  }

  /**
   * Retrieves and processes authentication methods from the store.
   *
   * @param authMethods A map of authentication method types to their corresponding components
   * @param excludedAuthMethod Optional authentication method type to exclude from the results
   * @returns An Observable of filtered and sorted authentication methods
   */
  public getAuthMethods(
    authMethods: Map<AuthMethodType, AuthMethodTypeComponent>,
    excludedAuthMethod?: AuthMethodType,
  ): Observable<AuthMethod[]> {
    return this.store.pipe(
      select(getAuthenticationMethods),
      map((methods: AuthMethod[]) => methods
        // ignore the given auth method if it should be excluded
        .filter((authMethod: AuthMethod) => excludedAuthMethod == null || authMethod.authMethodType !== excludedAuthMethod)
        .filter((authMethod: AuthMethod) => rendersAuthMethodType(authMethods, authMethod.authMethodType) !== undefined)
        .sort((method1: AuthMethod, method2: AuthMethod) => method1.position - method2.position),
      ),
      // ignore the ip authentication method when it's returned by the backend
      map((methods: AuthMethod[]) => uniqBy(methods.filter(a => a.authMethodType !== AuthMethodType.Ip), 'authMethodType')),
    );
  }
}
