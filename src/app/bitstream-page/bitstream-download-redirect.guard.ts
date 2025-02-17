import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, combineLatest, of as observableOf } from 'rxjs';
import { map, switchMap, filter, take } from 'rxjs/operators';

import { BitstreamDataService } from '../core/data/bitstream-data.service';
import { RemoteData } from '../core/data/remote-data';
import { HardRedirectService } from '../core/services/hard-redirect.service';
import { Bitstream } from '../core/shared/bitstream.model';
import { getFirstCompletedRemoteData } from '../core/shared/operators';
import { hasValue, isNotEmpty } from '../shared/empty.util';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../core/data/feature-authorization/feature-id';
import { AuthService } from '../core/auth/auth.service';
import { getForbiddenRoute } from '../app-routing-paths';
import { FileService } from '../core/shared/file.service';
import { BITSTREAM_PAGE_LINKS_TO_FOLLOW } from './bitstream-page.resolver';
import { redirectOn4xx } from '../core/shared/authorized.operators';

export const bitstreamDownloadRedirectGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  bitstreamDataService: BitstreamDataService = inject(BitstreamDataService),
  authorizationService: AuthorizationDataService = inject(AuthorizationDataService),
  auth: AuthService = inject(AuthService),
  fileService: FileService = inject(FileService),
  hardRedirectService: HardRedirectService = inject(HardRedirectService),
  router: Router = inject(Router),
): Observable<UrlTree | boolean> => {

  const bitstreamId = route.params.id;

  return bitstreamDataService.findById(bitstreamId, true, false, ...BITSTREAM_PAGE_LINKS_TO_FOLLOW).pipe(
    getFirstCompletedRemoteData(),
    redirectOn4xx(router, auth),
    switchMap((rd: RemoteData<Bitstream>) => {
      if (rd.hasSucceeded && !rd.hasNoContent) {
        const bitstream = rd.payload;
        const isAuthorized$ = authorizationService.isAuthorized(FeatureID.CanDownload, bitstream.self);
        const isLoggedIn$ = auth.isAuthenticated();
        return combineLatest([isAuthorized$, isLoggedIn$, observableOf(bitstream)]);
      } else {
        return observableOf([false, false, null]);
      }
    }),
    filter(([isAuthorized, isLoggedIn, bitstream]: [boolean, boolean, Bitstream]) => hasValue(isAuthorized) && hasValue(isLoggedIn)),
    take(1),
    switchMap(([isAuthorized, isLoggedIn, bitstream]: [boolean, boolean, Bitstream]) => {
      if (isAuthorized && isLoggedIn) {
        return fileService.retrieveFileDownloadLink(bitstream._links.content.href).pipe(
          filter((fileLink) => hasValue(fileLink)),
          take(1),
          map((fileLink) => {
            return [isAuthorized, isLoggedIn, bitstream, fileLink];
          }));
      } else {
        return observableOf([isAuthorized, isLoggedIn, bitstream, '']);
      }
    }),
    map(([isAuthorized, isLoggedIn, bitstream, fileLink]: [boolean, boolean, Bitstream, string]) => {
      if (isAuthorized && isLoggedIn && isNotEmpty(fileLink)) {
        hardRedirectService.redirect(fileLink);
        return false;
      } else if (isAuthorized && !isLoggedIn) {
        hardRedirectService.redirect(bitstream._links.content.href);
        return false;
      } else if (!isAuthorized && isLoggedIn) {
        return router.createUrlTree([getForbiddenRoute()]);
      } else if (!isAuthorized && !isLoggedIn) {
        auth.setRedirectUrl(router.url);
        return router.createUrlTree(['login']);
      }
    })
  );
};
