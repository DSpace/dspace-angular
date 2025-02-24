import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import {
  Community,
  CommunityDataService,
  getFirstCompletedRemoteData,
  RemoteData,
} from '@dspace/core';
import {
  hasNoValue,
  hasValue,
} from '@dspace/shared/utils';
import {
  Observable,
  of as observableOf,
} from 'rxjs';
import {
  map,
  tap,
} from 'rxjs/operators';

/**
 * True when either a parent ID query parameter has been provided and the parent ID resolves to a valid parent community
 * Reroutes to a 404 page when the page cannot be activated
 */
export const createCollectionPageGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  communityService: CommunityDataService = inject(CommunityDataService),
  router: Router = inject(Router),
): Observable<boolean> => {
  const parentID = route.queryParams.parent;
  if (hasNoValue(parentID)) {
    router.navigate(['/404']);
    return observableOf(false);
  }
  return communityService.findById(parentID)
    .pipe(
      getFirstCompletedRemoteData(),
      map((communityRD: RemoteData<Community>) => hasValue(communityRD) && communityRD.hasSucceeded && hasValue(communityRD.payload)),
      tap((isValid: boolean) => {
        if (!isValid) {
          router.navigate(['/404']);
        }
      }),
    );
};

