import { inject } from '@angular/core';
import {
  ResolveFn,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { getForbiddenRoute } from '../../app-routing-paths';
import { hasValue } from '../../shared/empty.util';
import { ItemRequestDataService } from '../data/item-request-data.service';
import { redirectOn4xx } from '../shared/authorized.operators';
import { ItemRequest } from '../shared/item-request.model';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteDataPayload,
} from '../shared/operators';
import { AuthService } from './auth.service';

export const accessTokenResolver: ResolveFn<ItemRequest> = (
  route,
  state,
  router: Router = inject(Router),
  authService: AuthService = inject(AuthService),
  itemRequestDataService: ItemRequestDataService = inject(ItemRequestDataService),
): Observable<ItemRequest> => {
  const accessToken = route.queryParams.accessToken;
  if ( !hasValue(accessToken) ) {
    return null;
  }
  // Get
  return itemRequestDataService.getSanitizedRequestByAccessToken(accessToken).pipe(
    getFirstCompletedRemoteData(),
    redirectOn4xx(router, authService),
    getFirstSucceededRemoteDataPayload(),
    tap(request => {
      if (!hasValue(request)) {
        console.dir('no request found for access token', accessToken);
        router.navigateByUrl(getForbiddenRoute());
      }
      console.dir('found request: ', request);
      console.dir(request);
      return request;
    }),
  );
};
