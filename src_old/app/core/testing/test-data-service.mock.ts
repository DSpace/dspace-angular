import { Injectable } from '@angular/core';
import { Operation } from 'fast-json-patch';
import {
  Observable,
  of,
} from 'rxjs';

import { FindListOptions } from '../data/find-list-options.model';
import { RemoteData } from '../data/remote-data';
import { FollowLinkConfig } from '../shared/follow-link-config.model';
import { Item } from '../shared/item.model';
import { createSuccessfulRemoteDataObject$ } from '../utilities/remote-data.utils';

@Injectable()
export class TestDataService {
  findListByHref(href: string, findListOptions: FindListOptions = {}, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<any>[]) {
    return of('findListByHref');
  }

  findByHref(href: string, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<any>[]) {
    return of('findByHref');
  }

  patch(object: Item, operations: Operation[]): Observable<RemoteData<Item>> {
    return createSuccessfulRemoteDataObject$(object);
  }
}
