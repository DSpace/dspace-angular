import { Observable } from 'rxjs';
import { ConfigObject } from './models/config.model';
import { RemoteData } from '../data/remote-data';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { getFirstCompletedRemoteData } from '../shared/operators';
import { map } from 'rxjs/operators';
import { BaseDataService } from '../data/base/base-data.service';
import { FindListOptions } from '../data/find-list-options.model';
import { PaginatedList } from '../data/paginated-list.model';

/**
 * Abstract data service to retrieve configuration objects from the REST server.
 * Common logic for configuration objects should be implemented here.
 */
export abstract class ConfigDataService extends BaseDataService<ConfigObject> {
  /**
   * Returns an observable of {@link RemoteData} of an object, based on an href, with a list of
   * {@link FollowLinkConfig}, to automatically resolve {@link HALLink}s of the object
   *
   * Throws an error if a configuration object cannot be retrieved.
   *
   * @param href                        The url of object we want to retrieve
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's
   *                                    no valid cached version. Defaults to true
   * @param reRequestOnStale            Whether or not the request should automatically be re-
   *                                    requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which
   *                                    {@link HALLink}s should be automatically resolved
   */
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

  /**
   * Returns an Observable of a {@link RemoteData} of a {@link PaginatedList} of objects, based on an href,
   * with a list of {@link FollowLinkConfig}, to automatically resolve {@link HALLink}s of the object
   *
   * @param href                       The url of list we want to retrieve. Can be a string or an Observable<string>
   * @param options
   * @param useCachedVersionIfAvailable If this is true, the request will only be sent if there's no valid cached version.
   * @param reRequestOnStale            Whether or not the request should automatically be re-requested after the response becomes stale
   * @param linksToFollow               List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   */
  findListByHref(href: string | Observable<string>, options: FindListOptions = {}, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<ConfigObject>[]): Observable<RemoteData<PaginatedList<ConfigObject>>> {
    return super.findListByHref(href, options, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow).pipe(
      getFirstCompletedRemoteData(),
      map((rd: RemoteData<PaginatedList<ConfigObject>>) => {
        if (rd.hasFailed) {
          throw new Error(`Couldn't retrieve the config`);
        } else {
          return rd;
        }
      }),
    );
  }
}
