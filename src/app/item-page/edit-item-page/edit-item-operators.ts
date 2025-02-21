import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { RemoteData } from '@dspace/core';
import { getAllSucceededRemoteData } from '@dspace/core';

/**
 * Return first Observable of a RemoteData object that complies to the provided predicate
 * @param predicate
 */
export const findSuccessfulAccordingTo = <T>(predicate: (rd: RemoteData<T>) => boolean) =>
  (source: Observable<RemoteData<T>>): Observable<RemoteData<T>> =>
    source.pipe(getAllSucceededRemoteData(),
      first(predicate));
