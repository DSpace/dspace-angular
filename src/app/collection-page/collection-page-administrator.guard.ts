import { CanActivateFn } from '@angular/router';
import { dsoPageSingleFeatureGuard } from '@dspace/core/data/feature-authorization/feature-authorization-guard/dso-page-single-feature.guard';
import { FeatureID } from '@dspace/core/data/feature-authorization/feature-id';
import { collectionPageResolver } from '@dspace/core/resolvers/collection-page.resolver';
import { of } from 'rxjs';

/**
 * Guard for preventing unauthorized access to certain {@link Collection} pages requiring administrator rights
 * Check administrator authorization rights
 */
export const collectionPageAdministratorGuard: CanActivateFn =
  dsoPageSingleFeatureGuard(
    () => collectionPageResolver,
    () => of(FeatureID.AdministratorOf),
  );
