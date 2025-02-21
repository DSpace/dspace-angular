import { CanActivateFn } from '@angular/router';
import { of as observableOf } from 'rxjs';

import { dsoPageSingleFeatureGuard } from '@dspace/core';
import { FeatureID } from '@dspace/core';
import { collectionPageResolver } from './collection-page.resolver';

/**
 * Guard for preventing unauthorized access to certain {@link Collection} pages requiring administrator rights
 * Check administrator authorization rights
 */
export const collectionPageAdministratorGuard: CanActivateFn =
  dsoPageSingleFeatureGuard(
    () => collectionPageResolver,
    () => observableOf(FeatureID.AdministratorOf),
  );
