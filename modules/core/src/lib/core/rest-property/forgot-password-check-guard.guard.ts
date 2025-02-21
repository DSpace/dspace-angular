import { CanActivateFn } from '@angular/router';
import { of as observableOf } from 'rxjs';

import { singleFeatureAuthorizationGuard } from '../data';
import { FeatureID } from '../data';

/**
 * Guard that checks if the forgot-password feature is enabled
 */
export const forgotPasswordCheckGuard: CanActivateFn =
  singleFeatureAuthorizationGuard(() => observableOf(FeatureID.EPersonForgotPassword));
