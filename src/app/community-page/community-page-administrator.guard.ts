import { CanActivateFn } from '@angular/router';
import { dsoPageSingleFeatureGuard, FeatureID } from '@dspace/core'
import { of } from 'rxjs';

import { communityPageResolver } from './community-page.resolver';

/**
 * Guard for preventing unauthorized access to certain {@link Community} pages requiring administrator rights
 * Check administrator authorization rights
 */
export const communityPageAdministratorGuard: CanActivateFn =
  dsoPageSingleFeatureGuard(
    () => communityPageResolver,
    () => of(FeatureID.AdministratorOf),
  );
