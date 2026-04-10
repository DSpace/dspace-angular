import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { BitstreamFormatDataService } from '@dspace/core/data/bitstream-format-data.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { BitstreamFormat } from '@dspace/core/shared/bitstream-format.model';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
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
