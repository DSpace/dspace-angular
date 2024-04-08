import {
  Injector,
  Type,
} from '@angular/core';
import {
  defer,
  Observable,
} from 'rxjs';

import { LazyDataServicesMap } from '../../config/app-config.interface';
import { isNotEmpty } from '../shared/empty.util';
import { HALDataService } from './data/base/hal-data-service.interface';

/**
 * Loads a service lazily. The service is loaded when the observable is subscribed to.
 *
 * @param map A map of promises returning the data services to load
 * @param key The key of the service
 * @param injector The injector to use to load the service. If not provided, the current injector is used.
 * @returns An observable of the service.
 *
 * @example
 * ```ts
 * const dataService$ = lazyDataService({ 'data-service': () => import('./data-service').then((m) => m.MyService)}, 'data-service', this.injector);
 * or
 * const dataService$ = lazyDataService({'data-service': () => import('./data-service')}, 'data-service', this.injector);
 * ```
 */
export function lazyDataService<T>(
  map: LazyDataServicesMap,
  key: string,
  injector: Injector,
): Observable<T> {
  return defer(() => {
    const loader: () => Promise<Type<HALDataService<any>> | { default: HALDataService<any> }> = map[key];
    if (isNotEmpty(loader) && typeof loader === 'function') {
      return loader()
        .then((serviceOrDefault) => {
          if ('default' in serviceOrDefault) {
            return injector!.get(serviceOrDefault.default);
          }
          return injector!.get(serviceOrDefault);
        })
        .catch((error) => {
          throw error;
        });
    } else {
      return null;
    }
  });
}
