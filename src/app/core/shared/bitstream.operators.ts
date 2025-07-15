import {
  Observable,
  of,
} from 'rxjs';
import {
  map,
  switchMap,
} from 'rxjs/operators';

import { hasValue } from '../../shared/empty.util';
import { AuthorizationDataService } from '../data/feature-authorization/authorization-data.service';
import { FeatureID } from '../data/feature-authorization/feature-id';
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
          return of(null);
        }
      }),
    );
