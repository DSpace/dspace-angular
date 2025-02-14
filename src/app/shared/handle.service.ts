import { Injectable } from '@angular/core';
import {
  Observable,
  of as observableOf,
} from 'rxjs';
import {
  map,
  take,
} from 'rxjs/operators';

import { ConfigurationDataService } from '../core/data/configuration-data.service';
import { RemoteData } from '../core/data/remote-data';
import { ConfigurationProperty } from '../core/shared/configuration-property.model';
import { getFirstCompletedRemoteData } from '../core/shared/operators';
import {
  hasNoValue,
  isEmpty,
} from './empty.util';

export const CANONICAL_PREFIX_KEY = 'handle.canonical.prefix';

const PREFIX_REGEX = (prefix: string | undefined) => {
  const formattedPrefix: string = prefix?.replace(/\/$/, '');
  return new RegExp(`(${formattedPrefix ? formattedPrefix  + '|' : '' }handle)\/([^\/]+\/[^\/]+)$`);
};
const NO_PREFIX_REGEX = /^([^\/]+\/[^\/]+)$/;

@Injectable({
  providedIn: 'root',
})
export class HandleService {

  constructor(
    protected configurationService: ConfigurationDataService,
  ) {
  }

  /**
   * Turns a handle string into the default 123456789/12345 format
   *
   * When the <b>handle.canonical.prefix</b> doesn't end with handle, be sure to expose the variable so that the
   * frontend can find the handle
   *
   * @param handle the input handle
   * @return
   * <ul>
   *   <li>normalizeHandle('123456789/123456')                                 // '123456789/123456'</li>
   *   <li>normalizeHandle('12.3456.789/123456')                               // '12.3456.789/123456'</li>
   *   <li>normalizeHandle('https://hdl.handle.net/123456789/123456')          // '123456789/123456'</li>
   *   <li>normalizeHandle('https://rest.api/server/handle/123456789/123456')  // '123456789/123456'</li>
   *   <li>normalizeHandle('https://rest.api/server/handle/123456789')         // null</li>
   * </ul>
   */
  normalizeHandle(handle: string): Observable<string | null> {
    if (hasNoValue(handle)) {
      return observableOf(null);
    }
    return this.configurationService.findByPropertyName(CANONICAL_PREFIX_KEY).pipe(
      getFirstCompletedRemoteData(),
      map((configurationPropertyRD: RemoteData<ConfigurationProperty>) => {
        if (configurationPropertyRD.hasSucceeded) {
          return configurationPropertyRD.payload.values.length >= 1 ? configurationPropertyRD.payload.values[0] : undefined;
        } else {
          return undefined;
        }
      }),
      map((prefix: string | undefined) => {
        let matches: string[];

        matches = handle.match(PREFIX_REGEX(prefix));

        if (isEmpty(matches) || matches.length < 3) {
          matches = handle.match(NO_PREFIX_REGEX);
        }

        if (isEmpty(matches) || matches.length < 2) {
          return null;
        } else {
          return matches[matches.length - 1];
        }
      }),
      take(1),
    );
  }

}
