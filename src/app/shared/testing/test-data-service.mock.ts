import { Injectable } from '@angular/core';
import { FindListOptions } from '@core/data/find-list-options.model';
import { RemoteData } from '@core/data/remote-data';
import { FollowLinkConfig } from '@core/shared/follow-link-config.model';
import { Item } from '@core/shared/item.model';
import { createSuccessfulRemoteDataObject$ } from '@core/utilities/remote-data.utils';
import { Operation } from 'fast-json-patch';
import {
  Observable,
  of,
} from 'rxjs';

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
