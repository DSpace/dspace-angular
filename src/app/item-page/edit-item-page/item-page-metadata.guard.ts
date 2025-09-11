import { CanActivateFn } from '@angular/router';
import { dsoPageSingleFeatureGuard, FeatureID } from '@dspace/core'
import { of } from 'rxjs';

import { itemPageResolver } from '../item-page.resolver';

/**
 * Guard for preventing unauthorized access to certain {@link Item} pages requiring edit metadata rights
 * Check edit metadata authorization rights
 */
export const itemPageMetadataGuard: CanActivateFn =
  dsoPageSingleFeatureGuard(
    () => itemPageResolver,
    () => of(FeatureID.CanEditMetadata),
  );
