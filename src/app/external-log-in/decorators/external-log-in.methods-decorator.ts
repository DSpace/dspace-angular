import { AuthRegistrationType } from 'src/app/core/auth/models/auth.registration-type';

import { OrcidConfirmationComponent } from '../registration-types/orcid-confirmation/orcid-confirmation.component';

export type ExternalLoginTypeComponent =
  typeof OrcidConfirmationComponent;

export const LOGIN_METHOD_FOR_DECORATOR_MAP = new Map<AuthRegistrationType, ExternalLoginTypeComponent>([
  [AuthRegistrationType.Orcid, OrcidConfirmationComponent],
]);

/**
 * Decorator to register the external login confirmation component for the given auth method type
 * @param authMethodType the type of the external login method
 */
export function renderExternalLoginConfirmationFor(
  authMethodType: AuthRegistrationType,
) {
  return function decorator(objectElement: any) {
    if (!objectElement) {
      return;
    }
    LOGIN_METHOD_FOR_DECORATOR_MAP.set(authMethodType, objectElement);
  };
}
/**
 *  Get the external login confirmation component for the given auth method type
 * @param authMethodType the type of the external login method
 */
export function getExternalLoginConfirmationType(
  authMethodType: AuthRegistrationType,
) {
  return LOGIN_METHOD_FOR_DECORATOR_MAP.get(authMethodType);
}
