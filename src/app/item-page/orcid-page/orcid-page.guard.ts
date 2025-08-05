import { CanActivateFn } from '@angular/router';
import { dsoPageSingleFeatureGuard } from '@dspace/core/data/feature-authorization/feature-authorization-guard/dso-page-single-feature.guard';
import { FeatureID } from '@dspace/core/data/feature-authorization/feature-id';
import { itemPageResolver } from '@dspace/core/resolvers/item-page.resolver';
import { of } from 'rxjs';

/**
 * Guard for preventing unauthorized access to certain {@link Item} pages requiring administrator rights
 * Check administrator authorization rights
 */
export const orcidPageGuard: CanActivateFn =
  dsoPageSingleFeatureGuard(
    () => itemPageResolver,
    () => of(FeatureID.CanSynchronizeWithORCID),
  );
