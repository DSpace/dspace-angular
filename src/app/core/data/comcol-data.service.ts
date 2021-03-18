import { distinctUntilChanged, filter, map, switchMap, take } from 'rxjs/operators';
import { combineLatest as observableCombineLatest, Observable } from 'rxjs';
import { hasValue, isEmpty, isNotEmpty } from '../../shared/empty.util';
import { ObjectCacheService } from '../cache/object-cache.service';
import { Community } from '../shared/community.model';
import { HALLink } from '../shared/hal-link.model';
import { CommunityDataService } from './community-data.service';

import { DataService } from './data.service';
import { FindListOptions } from './request.models';
import { PaginatedList } from './paginated-list.model';
import { RemoteData } from './remote-data';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { getFirstCompletedRemoteData } from '../shared/operators';
import { Bitstream } from '../shared/bitstream.model';
import { Collection } from '../shared/collection.model';
import { BitstreamDataService } from './bitstream-data.service';
import { NoContent } from '../shared/NoContent.model';
import { createFailedRemoteDataObject$ } from '../../shared/remote-data.utils';
import { URLCombiner } from '../url-combiner/url-combiner';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';

export abstract class ComColDataService<T extends Community | Collection> extends DataService<T> {
  protected abstract cds: CommunityDataService;
  protected abstract objectCache: ObjectCacheService;
  protected abstract halService: HALEndpointService;
  protected abstract bitstreamDataService: BitstreamDataService;

  /**
   * Get the scoped endpoint URL by fetching the object with
   * the given scopeID and returning its HAL link with this
   * data-service's linkPath
   *
   * @param {string} scopeID
   *    the id of the scope object
   * @return { Observable<string> }
   *    an Observable<string> containing the scoped URL
   */
  public getBrowseEndpoint(options: FindListOptions = {}, linkPath: string = this.linkPath): Observable<string> {
    if (isEmpty(options.scopeID)) {
      return this.halService.getEndpoint(linkPath);
    } else {
      const scopeCommunityHrefObs = this.cds.getEndpoint().pipe(
        map((endpoint: string) => this.cds.getIDHref(endpoint, options.scopeID)),
        filter((href: string) => isNotEmpty(href)),
        take(1)
      );

      this.createAndSendGetRequest(scopeCommunityHrefObs, true);

      return scopeCommunityHrefObs.pipe(
        switchMap((href: string) => this.rdbService.buildSingle<Community>(href)),
        getFirstCompletedRemoteData(),
        map((response: RemoteData<Community>) => {
          if (response.hasFailed) {
            throw new Error(`The Community with scope ${options.scopeID} couldn't be retrieved`);
          } else {
            return response.payload._links[linkPath];
          }
        }),
        filter((halLink: HALLink) => isNotEmpty(halLink)),
        map((halLink: HALLink) => halLink.href),
        distinctUntilChanged()
      );
    }
  }

  protected abstract getFindByParentHref(parentUUID: string): Observable<string>;

  public findByParent(parentUUID: string, options: FindListOptions = {}, ...linksToFollow: FollowLinkConfig<T>[]): Observable<RemoteData<PaginatedList<T>>> {
    const href$ = this.getFindByParentHref(parentUUID).pipe(
      map((href: string) => this.buildHrefFromFindOptions(href, options))
    );
    return this.findAllByHref(href$, options, true, true, ...linksToFollow);
  }

  /**
   * Get the endpoint for the community or collection's logo
   * @param id  The community or collection's ID
   */
  public getLogoEndpoint(id: string): Observable<string> {
    return this.halService.getEndpoint(this.linkPath).pipe(
      // We can't use HalLinkService to discover the logo link itself, as objects without a logo
      // don't have the link, and this method is also used in the createLogo method.
      map((href: string) => new URLCombiner(href, id, 'logo').toString())
    );
  }

  /**
   * Delete the logo from the community or collection
   * @param dso The object to delete the logo from
   */
  public deleteLogo(dso: T): Observable<RemoteData<NoContent>> {
    const logo$ = dso.logo;
    if (hasValue(logo$)) {
      // We need to fetch the logo before deleting it, because rest doesn't allow us to send a
      // DELETE request to a `/logo` link. So we need to use the bitstream self link.
      return logo$.pipe(
        getFirstCompletedRemoteData(),
        switchMap((logoRd: RemoteData<Bitstream>) => {
          if (logoRd.hasFailed) {
            console.error(`Couldn't retrieve the logo '${dso._links.logo.href}' in order to delete it.`);
            return [logoRd];
          } else {
            return this.bitstreamDataService.deleteByHref(logoRd.payload._links.self.href);
          }
        })
      );
    } else {
      return createFailedRemoteDataObject$(`The given object doesn't have a logo`, 400);
    }
  }

  public refreshCache(dso: T) {
    const parentCommunityUrl = this.parentCommunityUrlLookup(dso as any);
    if (!hasValue(parentCommunityUrl)) {
      return;
    }
    observableCombineLatest([
      this.findByHref(parentCommunityUrl).pipe(
        getFirstCompletedRemoteData(),
      ),
      this.halService.getEndpoint('communities/search/top').pipe(take(1))
    ]).subscribe(([rd, topHref]: [RemoteData<any>, string]) => {
      if (rd.hasSucceeded && isNotEmpty(rd.payload) && isNotEmpty(rd.payload.id)) {
        this.requestService.setStaleByHrefSubstring(rd.payload.id);
      } else {
        this.requestService.setStaleByHrefSubstring(topHref);
      }
    });
  }

  private parentCommunityUrlLookup(dso: Collection | Community) {
    const parentCommunity = dso._links.parentCommunity;
    return isNotEmpty(parentCommunity) ? parentCommunity.href : null;
  }
}
