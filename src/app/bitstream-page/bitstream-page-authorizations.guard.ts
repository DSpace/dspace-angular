import { CanActivateFn } from '@angular/router';
import {
  bitstreamPageResolver,
  dsoPageSingleFeatureGuard,
  FeatureID,
} from '@dspace/core';
import { of as observableOf } from 'rxjs';

/**
 * Guard for preventing unauthorized access to certain {@link Bitstream} pages requiring specific authorizations.
 * Checks authorization rights for managing policies.
 */
export const bitstreamPageAuthorizationsGuard: CanActivateFn =
  dsoPageSingleFeatureGuard(
    () => bitstreamPageResolver,
    () => observableOf(FeatureID.CanManagePolicies),
  );
