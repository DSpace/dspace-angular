import { CanActivateFn } from '@angular/router';
import { of } from 'rxjs';

import { FeatureID } from '../feature-id';
import { singleFeatureAuthorizationGuard } from './single-feature-authorization.guard';

/**
 * Prevent unauthorized activating and loading of routes when the current authenticated user doesn't have group
 * management rights
 */
export const groupAdministratorGuard: CanActivateFn =
  singleFeatureAuthorizationGuard(() => of(FeatureID.CanManageGroups));
