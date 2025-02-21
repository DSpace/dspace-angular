import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
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

import { CommunityDataService } from '../../../../modules/core/src/lib/core/data/community-data.service';
import { RemoteData } from '../../../../modules/core/src/lib/core/data/remote-data';
import { Community } from '../../../../modules/core/src/lib/core/shared/community.model';
import { getFirstCompletedRemoteData } from '../../../../modules/core/src/lib/core/shared/operators';

/**
 * True when either NO parent ID query parameter has been provided, or the parent ID resolves to a valid parent community
 * Reroutes to a 404 page when the page cannot be activated
 */
export const createCommunityPageGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  communityService: CommunityDataService = inject(CommunityDataService),
  router: Router = inject(Router),
): Observable<boolean> => {
  const parentID = route.queryParams.parent;
  if (hasNoValue(parentID)) {
    return observableOf(true);
  }

  return communityService.findById(parentID)
    .pipe(
      getFirstCompletedRemoteData(),
      map((communityRD: RemoteData<Community>) => hasValue(communityRD) && communityRD.hasSucceeded && hasValue(communityRD.payload)),
      tap((isValid: boolean) => {
        if (!isValid) {
          router.navigate(['/404']);
        }
      },
      ),
    );
};
