import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { followLink } from '../../../shared/utils/follow-link-config.model';
import { CommunityDataService } from '../../data/community-data.service';
import { RemoteData } from '../../data/remote-data';
import { Community } from '../community.model';
import { getFirstCompletedRemoteData } from '../operators';

export const editCommunityResolver: ResolveFn<RemoteData<Community>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Observable<RemoteData<Community>> => {
  const communityDataService = inject(CommunityDataService);

  return communityDataService.findByIdWithProjections(
    route.params.id,
    ['allLanguages'],
    true,
    false,
    followLink('logo'),
  ).pipe(
    getFirstCompletedRemoteData(),
  );
};
