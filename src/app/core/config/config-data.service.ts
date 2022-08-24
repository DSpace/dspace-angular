import { Observable } from 'rxjs';
import { ConfigObject } from './models/config.model';
import { RemoteData } from '../data/remote-data';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { getFirstCompletedRemoteData } from '../shared/operators';
import { map } from 'rxjs/operators';
import { BaseDataService } from '../data/base/base-data.service';

export abstract class ConfigDataService extends BaseDataService<ConfigObject> {
  public findByHref(href: string, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<ConfigObject>[]): Observable<RemoteData<ConfigObject>> {
    return super.findByHref(href, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow).pipe(
      getFirstCompletedRemoteData(),
      map((rd: RemoteData<ConfigObject>) => {
        if (rd.hasFailed) {
          throw new Error(`Couldn't retrieve the config`);
        } else {
          return rd;
        }
      }),
    );
  }
}
