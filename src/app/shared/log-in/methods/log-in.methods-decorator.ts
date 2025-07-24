import { Component } from '@angular/core';

import { RENDER_AUTH_METHOD_FOR_MAP } from '../../../../decorator-registries/render-auth-method-for-registry';
import { AuthMethodType } from '../../../core/auth/models/auth.method-type';
import { GenericConstructor } from '../../../core/shared/generic-constructor';
import { hasValue } from '../../empty.util';
import {
  DEFAULT_THEME,
  getMatch,
} from '../../object-collection/shared/listable-object/listable-object.decorator';

export const DEFAULT_METHOD_TYPE = AuthMethodType.Password;

export function renderAuthMethodFor(authMethodType: AuthMethodType) {
  return function decorator(objectElement: any) {
  };
}

/**
 * Retrieves the component matching the given {@link AuthMethodType}
 *
 * @param authMethodType The given {@link AuthMethodType}
 * @param theme The theme to retrieve the component for
 * @param registry The registry to search through. Defaults to RENDER_AUTH_METHOD_FOR_MAP, but other components can override this.
 */
export function getAuthMethodFor(authMethodType: AuthMethodType, theme: string, registry = RENDER_AUTH_METHOD_FOR_MAP): Promise<GenericConstructor<Component>> {
  const match = getMatch(registry, [authMethodType, theme], [DEFAULT_METHOD_TYPE, DEFAULT_THEME]);
  return hasValue(match) ? match.match() : undefined;
}
