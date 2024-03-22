import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import {
  Observable,
  of as observableOf,
} from 'rxjs';
import {
  map,
  tap,
} from 'rxjs/operators';

import { CommunityDataService } from '../../core/data/community-data.service';
import { RemoteData } from '../../core/data/remote-data';
import { Community } from '../../core/shared/community.model';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import {
  hasNoValue,
  hasValue,
} from '../../shared/empty.util';

/**
 * Prevent creation of a community with an invalid parent community provided
 * @class CreateCommunityPageGuard
 */
@Injectable({ providedIn: 'root' })
export class CreateCommunityPageGuard implements CanActivate {
  public constructor(private router: Router, private communityService: CommunityDataService) {
  }

  /**
   * True when either NO parent ID query parameter has been provided, or the parent ID resolves to a valid parent community
   * Reroutes to a 404 page when the page cannot be activated
   * @method canActivate
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const parentID = route.queryParams.parent;
    if (hasNoValue(parentID)) {
      return observableOf(true);
    }

    return this.communityService.findById(parentID)
      .pipe(
        getFirstCompletedRemoteData(),
        map((communityRD: RemoteData<Community>) => hasValue(communityRD) && communityRD.hasSucceeded && hasValue(communityRD.payload)),
        tap((isValid: boolean) => {
          if (!isValid) {
            this.router.navigate(['/404']);
          }
        },
        ),
      );
  }
}
