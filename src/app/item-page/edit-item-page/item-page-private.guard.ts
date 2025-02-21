import { CanActivateFn } from '@angular/router';
import { of as observableOf } from 'rxjs';

import { dsoPageSingleFeatureGuard } from '@dspace/core';
import { FeatureID } from '@dspace/core';
import { itemPageResolver } from '@dspace/core';

/**
 * Guard for preventing unauthorized access to certain {@link Item} pages requiring specific authorizations.
 * Checks authorization rights for making items private.
 */
export const itemPagePrivateGuard: CanActivateFn =
  dsoPageSingleFeatureGuard(
    () => itemPageResolver,
    () => observableOf(FeatureID.CanMakePrivate),
  );
