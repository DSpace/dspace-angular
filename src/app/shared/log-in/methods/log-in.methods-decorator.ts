import { Component, Type } from '@angular/core';
import { AuthMethodType } from '../../../core/auth/models/auth.method-type';

const authMethodsMap: Map<AuthMethodType, Type<Component>> = new Map();

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
