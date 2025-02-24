import { CanActivateFn } from '@angular/router';
import {
  dsoPageSingleFeatureGuard,
  FeatureID,
  itemPageResolver,
} from '@dspace/core';
import { of as observableOf } from 'rxjs';

/**
 * Guard for preventing unauthorized access to certain {@link Item} pages requiring edit metadata rights
 * Check edit metadata authorization rights
 */
export const itemPageMetadataGuard: CanActivateFn =
  dsoPageSingleFeatureGuard(
    () => itemPageResolver,
    () => observableOf(FeatureID.CanEditMetadata),
  );
