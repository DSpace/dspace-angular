import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { followLink } from '../../../shared/utils/follow-link-config.model';
import { ItemDataService } from '../../data/item-data.service';
import { RemoteData } from '../../data/remote-data';
import { Item } from '../item.model';
import { getFirstCompletedRemoteData } from '../operators';

const getFollowLinks = () => [
  followLink('owningCollection', {},
    followLink('parentCommunity', {},
      followLink('parentCommunity')),
  ),
  followLink('relationships'),
  followLink('version', {}, followLink('versionhistory')),
  followLink('thumbnail'),
  followLink('metrics'),
];

export const editItemResolver: ResolveFn<RemoteData<Item>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Observable<RemoteData<Item>> => {
  const itemDataService = inject(ItemDataService);

  return itemDataService.findByIdWithProjections(
    route.params.id,
    ['allLanguages'],
    true,
    false,
    ...getFollowLinks(),
  ).pipe(
    getFirstCompletedRemoteData(),
  );
};
