import { CanActivateFn } from '@angular/router';
import { of as observableOf } from 'rxjs';

import { dsoPageSingleFeatureGuard } from '../../core/data/feature-authorization/feature-authorization-guard/dso-page-single-feature.guard';
import { FeatureID } from '../../core/data/feature-authorization/feature-id';
import { itemPageResolver } from '../item-page.resolver';

/**
 * Guard for preventing unauthorized access to certain {@link Item} pages requiring manage versions rights
 * Check manage versions authorization rights
 */
export const itemPageVersionHistoryGuard: CanActivateFn =
  dsoPageSingleFeatureGuard(
    () => itemPageResolver,
    () => observableOf(FeatureID.CanManageVersions),
  );
