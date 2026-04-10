import { AuthMethodType } from '../../../core/auth/models/auth.method-type';
import { AuthMethodTypeComponent } from './auth-methods.type';

/**
 * Retrieves the authentication method component for a specific authentication method type.
 * @param authMethods A map of authentication method types to their corresponding components
 * @param authMethodType The specific authentication method type to retrieve
 * @returns The component associated with the given authentication method type, or undefined if not found
 */
export function rendersAuthMethodType(
  authMethods: Map<AuthMethodType, AuthMethodTypeComponent>,
  authMethodType: AuthMethodType,
) {
  return authMethods.get(authMethodType);
}
