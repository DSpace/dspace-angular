import { hasValue } from '@dspace/shared/utils';
import {
  Observable,
  of as observableOf,
} from 'rxjs';
import {
  map,
  switchMap,
} from 'rxjs/operators';

import { AuthorizationDataService } from '../data';
import { FeatureID } from '../data';
import { Bitstream } from './bitstream.model';

/**
 * Operator to check if the given bitstream is downloadable
 */
export const getDownloadableBitstream = (authService: AuthorizationDataService) =>
  (source: Observable<Bitstream>): Observable<Bitstream | null> =>
    source.pipe(
      switchMap((bit: Bitstream) => {
        if (hasValue(bit)) {
          return authService.isAuthorized(FeatureID.CanDownload, bit.self).pipe(
            map((canDownload: boolean) => {
              return canDownload ? bit : null;
            }));
        } else {
          return observableOf(null);
        }
      }),
    );
