import { CanActivateFn } from '@angular/router';
import { dsoPageSingleFeatureGuard } from '@dspace/core/data/feature-authorization/feature-authorization-guard/dso-page-single-feature.guard';
import { FeatureID } from '@dspace/core/data/feature-authorization/feature-id';
import { of } from 'rxjs';

import { collectionPageResolver } from './collection-page.resolver';

/**
 * Guard for preventing unauthorized access to certain {@link Collection} pages requiring administrator rights
 * Check administrator authorization rights
 */
export const collectionPageAdministratorGuard: CanActivateFn =
  dsoPageSingleFeatureGuard(
    () => collectionPageResolver,
    () => of(FeatureID.AdministratorOf),
  );
