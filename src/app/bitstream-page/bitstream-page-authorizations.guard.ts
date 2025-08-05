import { CanActivateFn } from '@angular/router';
import { dsoPageSingleFeatureGuard } from '@dspace/core/data/feature-authorization/feature-authorization-guard/dso-page-single-feature.guard';
import { FeatureID } from '@dspace/core/data/feature-authorization/feature-id';
import { bitstreamPageResolver } from '@dspace/core/resolvers/bitstream-page.resolver';
import { of } from 'rxjs';

/**
 * Guard for preventing unauthorized access to certain {@link Bitstream} pages requiring specific authorizations.
 * Checks authorization rights for managing policies.
 */
export const bitstreamPageAuthorizationsGuard: CanActivateFn =
  dsoPageSingleFeatureGuard(
    () => bitstreamPageResolver,
    () => of(FeatureID.CanManagePolicies),
  );
