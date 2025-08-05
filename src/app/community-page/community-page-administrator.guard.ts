import { CanActivateFn } from '@angular/router';
import { dsoPageSingleFeatureGuard } from '@dspace/core/data/feature-authorization/feature-authorization-guard/dso-page-single-feature.guard';
import { FeatureID } from '@dspace/core/data/feature-authorization/feature-id';
import { communityPageResolver } from '@dspace/core/resolvers/community-page.resolver';
import { of } from 'rxjs';

/**
 * Guard for preventing unauthorized access to certain {@link Community} pages requiring administrator rights
 * Check administrator authorization rights
 */
export const communityPageAdministratorGuard: CanActivateFn =
  dsoPageSingleFeatureGuard(
    () => communityPageResolver,
    () => of(FeatureID.AdministratorOf),
  );
