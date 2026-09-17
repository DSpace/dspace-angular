import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { BitstreamDataService } from '@dspace/core/data/bitstream-data.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import {
  Bitstream,
  BITSTREAM_PAGE_LINKS_TO_FOLLOW,
} from '@dspace/core/shared/bitstream.model';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import { Observable } from 'rxjs';

/**
 * Method for resolving a bitstream based on the parameters in the current route
 * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
 * @param {RouterStateSnapshot} state The current RouterStateSnapshot
 * @param {BitstreamDataService} bitstreamService
 * @returns Observable<<RemoteData<Item>> Emits the found bitstream based on the parameters in the current route,
 * or an error if something went wrong
 */
export const bitstreamPageResolver: ResolveFn<RemoteData<Bitstream>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  bitstreamService: BitstreamDataService = inject(BitstreamDataService),
): Observable<RemoteData<Bitstream>> => {
  return bitstreamService.findById(route.params.id, true, false, ...BITSTREAM_PAGE_LINKS_TO_FOLLOW)
    .pipe(
      getFirstCompletedRemoteData(),
    );
};
