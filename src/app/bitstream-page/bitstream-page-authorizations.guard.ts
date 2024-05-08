import { inject } from '@angular/core';
import { CanActivateFn, ResolveFn } from '@angular/router';
import { Observable, of as observableOf } from 'rxjs';
import { BitstreamPageResolver } from './bitstream-page.resolver';
import { Bitstream } from '../core/shared/bitstream.model';
import { dsoPageSingleFeatureGuard } from '../core/data/feature-authorization/feature-authorization-guard/dso-page-single-feature.guard';
import { FeatureID } from '../core/data/feature-authorization/feature-id';
import { RemoteData } from '../core/data/remote-data';

/**
 * Guard for preventing unauthorized access to certain {@link Bitstream} pages requiring specific authorizations.
 * Checks authorization rights for managing policies.
 */
export const bitstreamPageAuthorizationsGuard: CanActivateFn =
  dsoPageSingleFeatureGuard(
    () => {
      const bitstreamPageResolver = inject(BitstreamPageResolver);
      return bitstreamPageResolver.resolve as ResolveFn<Observable<RemoteData<Bitstream>>>;
    },
    () => observableOf(FeatureID.CanManagePolicies)
  );
