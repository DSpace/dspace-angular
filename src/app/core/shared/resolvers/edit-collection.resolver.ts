import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';

import { followLink } from '../../../shared/utils/follow-link-config.model';
import { CollectionDataService } from '../../data/collection-data.service';
import { RemoteData } from '../../data/remote-data';
import { Collection } from '../collection.model';
import { getFirstCompletedRemoteData } from '../operators';

export const editCollectionResolver: ResolveFn<RemoteData<Collection>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Observable<RemoteData<Collection>> => {
  const collectionDataService = inject(CollectionDataService);

  return collectionDataService.findByIdWithProjections(
    route.params.id,
    ['allLanguages'],
    true,
    false,
    followLink('parentCommunity', {}, followLink('parentCommunity')),
    followLink('logo'),
  ).pipe(
    getFirstCompletedRemoteData(),
  );
};
