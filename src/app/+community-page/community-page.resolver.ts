import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RemoteData } from '../core/data/remote-data';
import { getSucceededRemoteData } from '../core/shared/operators';
import { Community } from '../core/shared/community.model';
import { CommunityDataService } from '../core/data/community-data.service';

@Injectable()
export class CommunityPageResolver implements Resolve<RemoteData<Community>> {
  constructor(private communityService: CommunityDataService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RemoteData<Community>> {

    return this.communityService.findById(route.params.id).pipe(
      getSucceededRemoteData()
    );
  }
}
