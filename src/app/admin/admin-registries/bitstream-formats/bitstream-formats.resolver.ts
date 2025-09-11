import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import {
  BitstreamFormatDataService,
  RemoteData,
  BitstreamFormat,
  getFirstCompletedRemoteData,
} from '@dspace/core'
import { Observable } from 'rxjs';

/**
 * Method for resolving an bitstreamFormat based on the parameters in the current route
 * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
 * @param {RouterStateSnapshot} state
 * @param {BitstreamFormatDataService} bitstreamFormatDataService The BitstreamFormatDataService
 * @returns Observable<<RemoteData<BitstreamFormat>> Emits the found bitstreamFormat based on the parameters in the current route,
 * or an error if something went wrong
 */
export const bitstreamFormatsResolver: ResolveFn<RemoteData<BitstreamFormat>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  bitstreamFormatDataService: BitstreamFormatDataService = inject(BitstreamFormatDataService),
): Observable<RemoteData<BitstreamFormat>> => {
  return bitstreamFormatDataService.findById(route.params.id)
    .pipe(
      getFirstCompletedRemoteData(),
    );
};
