import { CanActivateFn } from '@angular/router';
import { of as observableOf } from 'rxjs';

import { dsoPageSingleFeatureGuard } from '../../../modules/core/src/lib/core/data/feature-authorization/feature-authorization-guard/dso-page-single-feature.guard';
import { FeatureID } from '../../../modules/core/src/lib/core/data/feature-authorization/feature-id';
import { bitstreamPageResolver } from '../../../modules/core/src/lib/core/shared/resolvers/bitstream-page.resolver';

/**
 * Guard for preventing unauthorized access to certain {@link Bitstream} pages requiring specific authorizations.
 * Checks authorization rights for managing policies.
 */
export const bitstreamPageAuthorizationsGuard: CanActivateFn =
  dsoPageSingleFeatureGuard(
    () => bitstreamPageResolver,
    () => observableOf(FeatureID.CanManagePolicies),
  );
