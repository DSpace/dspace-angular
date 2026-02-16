import { CanActivateFn } from '@angular/router';
import { of } from 'rxjs';

import { singleFeatureAuthorizationGuard } from '../data/feature-authorization/feature-authorization-guard/single-feature-authorization.guard';
import { FeatureID } from '../data/feature-authorization/feature-id';

/**
 * Guard that checks if the forgot-password feature is enabled
 */
export const forgotPasswordCheckGuard: CanActivateFn =
  singleFeatureAuthorizationGuard(() => of(FeatureID.EPersonForgotPassword));
