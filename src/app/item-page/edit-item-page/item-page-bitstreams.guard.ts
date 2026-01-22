import { CanActivateFn } from '@angular/router';
import { dsoPageSingleFeatureGuard } from '@dspace/core/data/feature-authorization/feature-authorization-guard/dso-page-single-feature.guard';
import { FeatureID } from '@dspace/core/data/feature-authorization/feature-id';
import { of } from 'rxjs';

import { itemPageResolver } from '../item-page.resolver';

/**
 * Guard for preventing unauthorized access to certain {@link Item} pages requiring manage bitstreams rights
 * Check manage bitstreams authorization rights
 */
export const itemPageBitstreamsGuard: CanActivateFn =
  dsoPageSingleFeatureGuard(
    () => itemPageResolver,
    () => of(FeatureID.CanManageBitstreamBundles),
  );
