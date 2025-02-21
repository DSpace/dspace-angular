import { CanActivateFn } from '@angular/router';
import { of as observableOf } from 'rxjs';

import { dsoPageSomeFeatureGuard } from '@dspace/core';
import { FeatureID } from '@dspace/core';
import { itemPageResolver } from '@dspace/core';

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
