import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RemoteData } from '../core/data/remote-data';
import { Community } from '../core/shared/community.model';
import { CommunityDataService } from '../core/data/community-data.service';
import { find } from 'rxjs/operators';
import { hasValue } from '../shared/empty.util';
import { followLink } from '../shared/utils/follow-link-config.model';

/**
 * This class represents a resolver that requests a specific community before the route is activated
 */
@Injectable()
export class CommunityPageResolver implements Resolve<RemoteData<Community>> {
  constructor(private communityService: CommunityDataService) {
  }

  /**
   * Method for resolving a community based on the parameters in the current route
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns Observable<<RemoteData<Community>> Emits the found community based on the parameters in the current route,
   * or an error if something went wrong
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RemoteData<Community>> {
    return this.communityService.findById(
      route.params.id,
      followLink('logo'),
      followLink('subcommunities'),
      followLink('collections')
    ).pipe(
      find((RD) => hasValue(RD.error) || RD.hasSucceeded)
    );
  }
}
