import { CanActivateFn } from '@angular/router';
import { of as observableOf } from 'rxjs';

import { dsoPageSingleFeatureGuard } from '../../../../modules/core/src/lib/core/data/feature-authorization/feature-authorization-guard/dso-page-single-feature.guard';
import { FeatureID } from '../../../../modules/core/src/lib/core/data/feature-authorization/feature-id';
import { itemPageResolver } from '../../../../modules/core/src/lib/core/shared/resolvers/item-page.resolver';

/**
 * Guard for preventing unauthorized access to certain {@link Item} pages requiring administrator rights
 */
export const itemPageAccessControlGuard: CanActivateFn =
  dsoPageSingleFeatureGuard(
    () => itemPageResolver,
    () => observableOf(FeatureID.AdministratorOf),
  );
