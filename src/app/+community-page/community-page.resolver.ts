import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { CommunityDataService } from '../core/data/community-data.service';
import { RemoteData } from '../core/data/remote-data';
import { Community } from '../core/shared/community.model';
import { getSucceededRemoteData } from '../core/shared/operators';

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
   * @returns Observable<<RemoteData<Community>> Emits the found community based on the parameters in the current route
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RemoteData<Community>> {
    return this.communityService.findById(route.params.id).pipe(
      getSucceededRemoteData()
    );
  }
}
