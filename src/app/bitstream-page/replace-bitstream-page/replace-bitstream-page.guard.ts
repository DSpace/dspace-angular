import { CanActivateFn } from '@angular/router';
import { dsoPageSingleFeatureGuard } from '@dspace/core/data/feature-authorization/feature-authorization-guard/dso-page-single-feature.guard';
import { FeatureID } from '@dspace/core/data/feature-authorization/feature-id';
import { of } from 'rxjs';

import { bitstreamPageResolver } from '../bitstream-page.resolver';

/**
 * Route guard that protects the replace-bitstream page from unauthorised access.
 *
 * Uses {@link dsoPageSingleFeatureGuard} to resolve the Bitstream from the current route via
 * {@link bitstreamPageResolver} and then checks whether the authenticated user holds the
 * {@link FeatureID.CanReplaceBitstream} feature authorisation for that Bitstream.
 * The feature is evaluated by the backend (`CanReplaceBitstreamFeature`) and takes into account
 * both repository configuration and the user's permissions on the Bitstream's owning Item.
 *
 * If the check fails the guard redirects to the configured unauthorised page.
 */
export const replaceBitstreamPageGuard: CanActivateFn =
  dsoPageSingleFeatureGuard(
    () => bitstreamPageResolver,
    () => of(FeatureID.CanReplaceBitstreamAdmin),
  );
