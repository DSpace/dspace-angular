import { CanActivateFn } from '@angular/router';
import { of } from 'rxjs';

import { FeatureID } from '../feature-id';
import {
  someFeatureAuthorizationGuard,
  StringGuardParamFn,
} from './some-feature-authorization.guard';


export const genericAdministratorGuard = (
  getObjectUrl?: StringGuardParamFn,
  getEPersonUuid?: StringGuardParamFn,
): CanActivateFn => someFeatureAuthorizationGuard(
  () => of([
    FeatureID.AdministratorOf,
    FeatureID.IsCommunityAdmin,
    FeatureID.IsCollectionAdmin,
  ]),
  getObjectUrl,
  getEPersonUuid);


