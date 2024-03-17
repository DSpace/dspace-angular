import { Injectable } from '@angular/core';
import { of } from 'rxjs';

import { FindListOptions } from '../../core/data/find-list-options.model';
import { FollowLinkConfig } from '../utils/follow-link-config.model';

@Injectable()
export class TestDataService {
  findListByHref(href: string, findListOptions: FindListOptions = {}, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<any>[]) {
    return of('findListByHref');
  }

  findByHref(href: string, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<any>[]) {
    return of('findByHref');
  }
}
