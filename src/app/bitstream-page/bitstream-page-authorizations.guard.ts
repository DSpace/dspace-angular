import { CanActivateFn } from '@angular/router';
import { dsoPageSingleFeatureGuard, FeatureID } from '@dspace/core'
import { of } from 'rxjs';

import { bitstreamPageResolver } from './bitstream-page.resolver';

/**
 * Guard for preventing unauthorized access to certain {@link Bitstream} pages requiring specific authorizations.
 * Checks authorization rights for managing policies.
 */
export const bitstreamPageAuthorizationsGuard: CanActivateFn =
  dsoPageSingleFeatureGuard(
    () => bitstreamPageResolver,
    () => of(FeatureID.CanManagePolicies),
  );
