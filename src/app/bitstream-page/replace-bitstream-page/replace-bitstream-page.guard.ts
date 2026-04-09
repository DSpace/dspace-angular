import { CanActivateFn } from '@angular/router';
import { dsoPageSingleFeatureGuard } from '@dspace/core/data/feature-authorization/feature-authorization-guard/dso-page-single-feature.guard';
import { FeatureID } from '@dspace/core/data/feature-authorization/feature-id';
import { of } from 'rxjs';

import { bitstreamPageResolver } from '../bitstream-page.resolver';

/**
 * Guard for preventing unauthorized access to the replace bitstream page.
 * Checks whether the user has permission to replace the bitstream (if the feature is enabled).
 */
export const replaceBitstreamPageGuard: CanActivateFn =
  dsoPageSingleFeatureGuard(
    () => bitstreamPageResolver,
    () => of(FeatureID.CanReplaceBitstream),
  );
