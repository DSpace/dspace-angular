import { CanActivateFn } from '@angular/router';
import { of as observableOf } from 'rxjs';

import { FeatureID } from '../feature-id';
import { singleFeatureAuthorizationGuard } from './single-feature-authorization.guard';

/**
 * Prevent unauthorized activating and loading of routes when the current authenticated user
 * isn't a Collection administrator
 * Check group management rights
 */
export const collectionAdministratorGuard: CanActivateFn =
  singleFeatureAuthorizationGuard(() => observableOf(FeatureID.IsCollectionAdmin));
