import { CanActivateFn } from '@angular/router';
import { singleFeatureAuthorizationGuard } from './single-feature-authorization.guard';
import { of as observableOf } from 'rxjs';
import { FeatureID } from '../feature-id';

/**
 * Prevent unauthorized activating and loading of routes when the current authenticated user
 * isn't a Community administrator
 * Check group management rights
 */
export const communityAdministratorGuard: CanActivateFn =
  singleFeatureAuthorizationGuard(() => observableOf(FeatureID.IsCommunityAdmin));
