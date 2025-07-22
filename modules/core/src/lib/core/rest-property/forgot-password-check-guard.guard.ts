import { CanActivateFn } from '@angular/router';
import { of as observableOf } from 'rxjs';

import {
  FeatureID,
  singleFeatureAuthorizationGuard,
} from '../data';

/**
 * Guard that checks if the forgot-password feature is enabled
 */
export const forgotPasswordCheckGuard: CanActivateFn =
  singleFeatureAuthorizationGuard(() => observableOf(FeatureID.EPersonForgotPassword));
