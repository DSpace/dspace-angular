import {
  Injector,
  Type,
} from '@angular/core';
import {
  defer,
  Observable,
} from 'rxjs';

/**
 * Loads a service lazily. The service is loaded when the observable is subscribed to.
 *
 * @param loader A function that returns a promise of the service to load.
 * @param injector The injector to use to load the service. If not provided, the current injector is used.
 * @returns An observable of the service.
 *
 * @example
 * ```ts
 * const dataService$ = lazyService(() => import('./data-service').then((m) => m.MyService), this.injector);
 * or
 * const dataService$ = lazyService(() => import('./data-service'), this.injector);
 * ```
 */
export function lazyService<T>(
  loader: () => Promise<Type<T>> | Promise<{ default: Type<T> }>,
  injector: Injector,
): Observable<T> {
  return defer(() => {
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
  });
}
