import { CanActivateFn } from '@angular/router';
import { dsoPageSingleFeatureGuard, FeatureID } from '@dspace/core'
import { of } from 'rxjs';

import { itemPageResolver } from '../item-page.resolver';

/**
 * Guard for preventing unauthorized access to certain {@link Item} pages requiring specific authorizations.
 * Checks authorization rights for moving items.
 */
export const itemPageMoveGuard: CanActivateFn =
  dsoPageSingleFeatureGuard(
    () => itemPageResolver,
    () => of(FeatureID.CanMove),
  );
