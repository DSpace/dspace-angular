import { CanActivateFn } from '@angular/router';
import {
  dsoPageSomeFeatureGuard,
  FeatureID,
  itemPageResolver,
} from '@dspace/core';
import { of as observableOf } from 'rxjs';

/**
 * Guard for preventing unauthorized access to certain {@link Item} pages requiring any of the rights required for
 * the status page
 * Check authorization rights
 */
export const itemPageStatusGuard: CanActivateFn =
  dsoPageSomeFeatureGuard(
    () => itemPageResolver,
    () => observableOf([FeatureID.CanManageMappings, FeatureID.WithdrawItem, FeatureID.ReinstateItem, FeatureID.CanManagePolicies, FeatureID.CanMakePrivate, FeatureID.CanDelete, FeatureID.CanMove, FeatureID.CanRegisterDOI]),
  );
