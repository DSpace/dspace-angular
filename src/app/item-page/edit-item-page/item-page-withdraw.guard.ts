import { CanActivateFn } from '@angular/router';
import { of as observableOf } from 'rxjs';

import { dsoPageSingleFeatureGuard } from '../../core/data/feature-authorization/feature-authorization-guard/dso-page-single-feature.guard';
import { FeatureID } from '../../core/data/feature-authorization/feature-id';
import { itemPageResolver } from '../../core/shared/resolvers/item-page.resolver';

/**
 * Guard for preventing unauthorized access to certain {@link Item} pages requiring withdraw rights
 * Check withdraw authorization rights
 */
export const itemPageWithdrawGuard: CanActivateFn =
  dsoPageSingleFeatureGuard(
    () => itemPageResolver,
    () => observableOf(FeatureID.WithdrawItem),
  );
