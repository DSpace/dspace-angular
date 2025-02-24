import { CanActivateFn } from '@angular/router';
import {
  dsoPageSingleFeatureGuard,
  FeatureID,
  itemPageResolver,
} from '@dspace/core';
import { of as observableOf } from 'rxjs';

/**
 * Guard for preventing unauthorized access to certain {@link Item} pages requiring manage mappings rights
 * Check manage mappings authorization rights
 */
export const itemPageCollectionMapperGuard: CanActivateFn =
  dsoPageSingleFeatureGuard(
    () => itemPageResolver,
    () => observableOf(FeatureID.CanManageMappings),
  );
