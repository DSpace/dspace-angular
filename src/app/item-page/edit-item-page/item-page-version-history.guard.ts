import { CanActivateFn } from '@angular/router';
import { dsoPageSingleFeatureGuard, FeatureID } from '@dspace/core'
import { of } from 'rxjs';

import { itemPageResolver } from '../item-page.resolver';

/**
 * Guard for preventing unauthorized access to certain {@link Item} pages requiring manage versions rights
 * Check manage versions authorization rights
 */
export const itemPageVersionHistoryGuard: CanActivateFn =
  dsoPageSingleFeatureGuard(
    () => itemPageResolver,
    () => of(FeatureID.CanManageVersions),
  );
