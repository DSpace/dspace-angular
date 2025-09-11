import { CanActivateFn } from '@angular/router';
import { dsoPageSomeFeatureGuard, FeatureID } from '@dspace/core'
import { of } from 'rxjs';

import { itemPageResolver } from '../item-page.resolver';

/**
 * Guard for preventing unauthorized access to certain {@link Item} pages requiring any of the rights required for
 * the status page
 * Check authorization rights
 */
export const itemPageStatusGuard: CanActivateFn =
  dsoPageSomeFeatureGuard(
    () => itemPageResolver,
    () => of([FeatureID.CanManageMappings, FeatureID.WithdrawItem, FeatureID.ReinstateItem, FeatureID.CanManagePolicies, FeatureID.CanMakePrivate, FeatureID.CanDelete, FeatureID.CanMove, FeatureID.CanRegisterDOI]),
  );
