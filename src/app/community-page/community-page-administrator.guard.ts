import { CanActivateFn } from '@angular/router';
import { of as observableOf } from 'rxjs';

import { dsoPageSingleFeatureGuard } from '../../../modules/core/src/lib/core/data/feature-authorization/feature-authorization-guard/dso-page-single-feature.guard';
import { FeatureID } from '../../../modules/core/src/lib/core/data/feature-authorization/feature-id';
import { communityPageResolver } from './community-page.resolver';

/**
 * Guard for preventing unauthorized access to certain {@link Community} pages requiring administrator rights
 * Check administrator authorization rights
 */
export const communityPageAdministratorGuard: CanActivateFn =
  dsoPageSingleFeatureGuard(
    () => communityPageResolver,
    () => observableOf(FeatureID.AdministratorOf),
  );
