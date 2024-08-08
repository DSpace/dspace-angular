import { CanActivateFn } from '@angular/router';
import { of as observableOf } from 'rxjs';

import { FeatureID } from '../feature-id';
import { singleFeatureAuthorizationGuard } from './single-feature-authorization.guard';

/**
 * Prevent unauthorized activating and loading of routes when the current authenticated user doesn't have administrator
 * rights to the {@link Site}
 */
export const siteAdministratorGuard: CanActivateFn =
  singleFeatureAuthorizationGuard(() => observableOf(FeatureID.AdministratorOf));
