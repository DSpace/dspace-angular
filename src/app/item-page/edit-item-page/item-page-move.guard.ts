import { CanActivateFn } from '@angular/router';
import {
  dsoPageSingleFeatureGuard,
  FeatureID,
  itemPageResolver,
} from '@dspace/core';
import { of as observableOf } from 'rxjs';

/**
 * Guard for preventing unauthorized access to certain {@link Item} pages requiring specific authorizations.
 * Checks authorization rights for moving items.
 */
export const itemPageMoveGuard: CanActivateFn =
  dsoPageSingleFeatureGuard(
    () => itemPageResolver,
    () => observableOf(FeatureID.CanMove),
  );
