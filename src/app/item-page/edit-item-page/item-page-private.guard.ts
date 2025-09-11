import { CanActivateFn } from '@angular/router';
import { dsoPageSingleFeatureGuard, FeatureID } from '@dspace/core'
import { of } from 'rxjs';

import { itemPageResolver } from '../item-page.resolver';

/**
 * Guard for preventing unauthorized access to certain {@link Item} pages requiring specific authorizations.
 * Checks authorization rights for making items private.
 */
export const itemPagePrivateGuard: CanActivateFn =
  dsoPageSingleFeatureGuard(
    () => itemPageResolver,
    () => of(FeatureID.CanMakePrivate),
  );
