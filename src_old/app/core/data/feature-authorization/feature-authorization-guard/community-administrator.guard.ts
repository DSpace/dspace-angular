import { CanActivateFn } from '@angular/router';
import { of } from 'rxjs';

import { FeatureID } from '../feature-id';
import { singleFeatureAuthorizationGuard } from './single-feature-authorization.guard';

/**
 * Prevent unauthorized activating and loading of routes when the current authenticated user
 * isn't a Community administrator
 * Check group management rights
 */
export const communityAdministratorGuard: CanActivateFn =
  singleFeatureAuthorizationGuard(() => of(FeatureID.IsCommunityAdmin));
