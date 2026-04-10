import { inject } from '@angular/core';
import {
  ResolveFn,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import {
  map,
  tap,
} from 'rxjs/operators';

import { getForbiddenRoute } from '../../app-routing-paths';
import { hasValue } from '../../shared/empty.util';
import { ItemRequestDataService } from '../data/item-request-data.service';
import { RemoteData } from '../data/remote-data';
import { redirectOn4xx } from '../shared/authorized.operators';
import { ItemRequest } from '../shared/item-request.model';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteDataPayload,
} from '../shared/operators';
import { AuthService } from './auth.service';

/**
 * Resolve an ItemRequest based on the accessToken in the query params
 * Used in item-page-routes.ts to resolve the item request for all Item page components
 * @param route
 * @param state
 * @param router
 * @param authService
 * @param itemRequestDataService
 */
export const accessTokenResolver: ResolveFn<ItemRequest> = (
  route,
  state,
  router: Router = inject(Router),
  authService: AuthService = inject(AuthService),
  itemRequestDataService: ItemRequestDataService = inject(ItemRequestDataService),
): Observable<ItemRequest> => {
  const accessToken = route.queryParams.accessToken;
  // Set null object if accesstoken is empty
  if ( !hasValue(accessToken) ) {
    return null;
  }
  // Get the item request from the server
  return itemRequestDataService.getSanitizedRequestByAccessToken(accessToken).pipe(
    getFirstCompletedRemoteData(),
    // Handle authorization errors, not found errors and forbidden errors as normal
    redirectOn4xx(router, authService),
    map((rd: RemoteData<ItemRequest>) => rd),
    // Get payload of the item request
    getFirstSucceededRemoteDataPayload(),
    tap(request => {
      if (!hasValue(request)) {
        // If the request is not found, redirect to 403 Forbidden
        router.navigateByUrl(getForbiddenRoute());
      }
      // Return the resolved item request object
      return request;
    }),
  );
};
