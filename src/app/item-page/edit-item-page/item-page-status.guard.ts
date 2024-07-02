import { CanActivateFn } from '@angular/router';
import { of as observableOf } from 'rxjs';

import { dsoPageSomeFeatureGuard } from '../../core/data/feature-authorization/feature-authorization-guard/dso-page-some-feature.guard';
import { FeatureID } from '../../core/data/feature-authorization/feature-id';
import { itemPageResolver } from '../item-page.resolver';

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
