import { Component } from '@angular/core';
import { AuthRegistrationType } from '@dspace/core/auth/models/auth.registration-type';
import { hasValue } from '@dspace/shared/utils/empty.util';

import { RENDER_EXTERNAL_LOGIN_CONFIRMATION_FOR_MAP } from '../../../decorator-registries/render-external-login-confirmation-for-registry';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import {
  DEFAULT_THEME,
  getMatch,
} from '../../shared/object-collection/shared/listable-object/listable-object.decorator';

/**
 * Decorator to register the external login confirmation component for the given auth method type
 * @param authRegistrationType the type of the external login method
 * @param theme The theme of the
 */
export function renderExternalLoginConfirmationFor(authRegistrationType: AuthRegistrationType, theme: string = DEFAULT_THEME) {
  return function decorator(objectElement: any) {
  };
}

/**
 * Get the external login confirmation component for the given auth method type
 *
 * @param authRegistrationType the type of the external login method
 * @param theme The theme to match
 */
export function getExternalLoginConfirmationType(authRegistrationType: AuthRegistrationType, theme: string, registry = RENDER_EXTERNAL_LOGIN_CONFIRMATION_FOR_MAP): Promise<GenericConstructor<Component>> {
  const match = getMatch(registry, [authRegistrationType, theme], [undefined, DEFAULT_THEME]);
  return hasValue(match) ? match.match() : undefined;
}
