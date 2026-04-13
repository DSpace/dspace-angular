import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { getForbiddenRoute } from '@dspace/core/router/core-routing-paths';
import {
  combineLatest,
  Observable,
  of,
} from 'rxjs';
import {
  filter,
  map,
  switchMap,
  take,
} from 'rxjs/operators';

import { AuthService } from '../core/auth/auth.service';
import { BitstreamDataService } from '../core/data/bitstream-data.service';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../core/data/feature-authorization/feature-id';
import { RemoteData } from '../core/data/remote-data';
import { HardRedirectService } from '../core/services/hard-redirect.service';
import { redirectOn4xx } from '../core/shared/authorized.operators';
import {
  Bitstream,
  BITSTREAM_PAGE_LINKS_TO_FOLLOW,
} from '../core/shared/bitstream.model';
import { FileService } from '../core/shared/file.service';
import { getFirstCompletedRemoteData } from '../core/shared/operators';
import {
  hasValue,
  isNotEmpty,
} from '../utils/empty.util';

/**
 * Guard that handles bitstream download authorization and redirection logic.
 * This guard intercepts bitstream download requests and performs the following checks and actions:
 *
 * 1. **Retrieves the bitstream** by ID from the route parameters
 * 2. **Checks authorization** using the CanDownload feature permission
 * 3. **Determines authentication status** of the current user
 * 4. **Handles different scenarios**:
 *    - **Authorized + Logged in**: Retrieves a secure download link and redirects to it
 *    - **Authorized + Not logged in + No access token**: Direct redirect to bitstream content URL
 *    - **Not authorized + Has access token**: Redirect to content URL with access token appended
 *    - **Not authorized + Logged in**: Redirect to forbidden page
 *    - **Not authorized + Not logged in**: Store current URL and redirect to login page
 *
 * @param route - The activated route snapshot containing the bitstream ID and optional access token
 * @param state - The router state snapshot
 * @param bitstreamDataService - Service for retrieving bitstream data
 * @param authorizationService - Service for checking download authorization
 * @param auth - Service for authentication operations
 * @param fileService - Service for retrieving secure file download links
 * @param hardRedirectService - Service for performing hard redirects to download URLs
 * @param router - Angular router for navigation
 * @returns Observable that emits a UrlTree for navigation or boolean to allow/prevent route activation
 */
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
  const accessToken: string = route.queryParams.accessToken;

  return bitstreamDataService.findById(bitstreamId, true, false, ...BITSTREAM_PAGE_LINKS_TO_FOLLOW).pipe(
    getFirstCompletedRemoteData(),
    redirectOn4xx(router, auth),
    switchMap((rd: RemoteData<Bitstream>) => {
      if (rd.hasSucceeded && !rd.hasNoContent) {
        const bitstream = rd.payload;
        const isAuthorized$ = authorizationService.isAuthorized(FeatureID.CanDownload, bitstream.self);
        const isLoggedIn$ = auth.isAuthenticated();
        return combineLatest([isAuthorized$, isLoggedIn$, of(bitstream)]);
      } else {
        return of([false, false, null]);
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
        return of([isAuthorized, isLoggedIn, bitstream, '']);
      }
    }),
    map(([isAuthorized, isLoggedIn, bitstream, fileLink]: [boolean, boolean, Bitstream, string]) => {
      if (isAuthorized && isLoggedIn && isNotEmpty(fileLink)) {
        hardRedirectService.redirect(fileLink, null, true);
        return false;
      } else if (isAuthorized && !isLoggedIn && !hasValue(accessToken)) {
        hardRedirectService.redirect(bitstream._links.content.href, null, true);
        return false;
      } else if (!isAuthorized) {
        if (hasValue(accessToken)) {
          hardRedirectService.redirect(bitstream._links.content.href + '?accessToken=' + accessToken, null, true);
          return false;
        } else if (isLoggedIn) {
          return router.createUrlTree([getForbiddenRoute()]);
        } else if (!isLoggedIn) {
          auth.setRedirectUrl(router.url);
          return router.createUrlTree(['login']);
        }
      }
    }),
  );
};
