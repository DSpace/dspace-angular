import { CanActivateFn } from '@angular/router';
import { of as observableOf } from 'rxjs';

import { FeatureID } from '../feature-id';
import { singleFeatureAuthorizationGuard } from './single-feature-authorization.guard';

/**
 * Prevent unauthorized activating and loading of routes when the current authenticated user doesn't have registration
 * rights to the {@link Site}
 */
export const siteRegisterGuard: CanActivateFn =
  singleFeatureAuthorizationGuard(() => observableOf(FeatureID.EPersonRegistration));
