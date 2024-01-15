import { Component, Type } from '@angular/core';
import { AuthMethodType } from '../../../core/auth/models/auth.method-type';
import { LogInPasswordComponent } from './password/log-in-password.component';
import { LogInExternalProviderComponent } from './log-in-external-provider/log-in-external-provider.component';

const authMethodsMap: Map<AuthMethodType, any> = new Map();

authMethodsMap.set(AuthMethodType.Password, LogInPasswordComponent);
authMethodsMap.set(AuthMethodType.Shibboleth, LogInExternalProviderComponent);
authMethodsMap.set(AuthMethodType.Oidc, LogInExternalProviderComponent);
authMethodsMap.set(AuthMethodType.Orcid, LogInExternalProviderComponent);
export function renderAuthMethodFor(authMethodType: AuthMethodType) {
  return function decorator(objectElement: any) {
    if (!objectElement) {
      return;
    }
    authMethodsMap.set(authMethodType, objectElement);
  };
}

export function rendersAuthMethodType(authMethodType: AuthMethodType): Type<Component> | undefined {
  return authMethodsMap.get(authMethodType);
}
