import { Breadcrumb } from '../../breadcrumbs/breadcrumb/breadcrumb.model';
import { BreadcrumbsProviderService } from './breadcrumbsProviderService';
import { DSONameService } from './dso-name.service';
import { Observable } from 'rxjs';
import { LinkService } from '../cache/builders/link.service';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { map } from 'rxjs/operators';
import { hasValue } from '../../shared/empty.util';
import { Injectable } from '@angular/core';
import { getItemPageRoute } from '../../item-page/item-page-routing-paths';
import { Item } from '../shared/item.model';
import { Community } from '../shared/community.model';
import { TranslateService } from '@ngx-translate/core';
import { CommunityDataService } from '../data/community-data.service';
import { CollectionDataService } from '../data/collection-data.service';
import { Collection } from '../shared/collection.model';
import { ItemDataService } from '../data/item-data.service';
import { getFirstCompletedRemoteData, getRemoteDataPayload } from '../shared/operators';
import { getCollectionPageRoute } from '../../collection-page/collection-page-routing-paths';
import { getCommunityPageRoute } from '../../community-page/community-page-routing-paths';
import { getItemPageLinksToFollow } from 'src/app/item-page/item.resolver';

/**
 * Service to calculate DSpaceObject breadcrumbs for a single part of the route
 */
@Injectable({
  providedIn: 'root'
})
export class DsoContextBreadcrumbService implements BreadcrumbsProviderService<string> {
  constructor(
    private linkService: LinkService,
    private translate: TranslateService,
    protected itemDataService: ItemDataService,
    private collectionService: CollectionDataService,
    private communityService: CommunityDataService,
    private dsoNameService: DSONameService
  ) {

  }

  /**
   * Method to calculate the breadcrumbs
   * This method returns the array of breadcrumbs
   * @param key The key (a string) of concatenation of uuid of the item and breadcrumb key
   * @param url The url to use as a link for this breadcrumb
   */
  getBreadcrumbs(key: string, url: string): Observable<Breadcrumb[]> {

    const keyArr = key.split('::');

    const breadcrumbKey = keyArr[1];
    const uuid = keyArr[0];

    // In the statistics url, check the type of item
    if (url.includes('communities')) {
      return this.getCommunity(uuid,url,breadcrumbKey);
    } else if (url.includes('collections')) {
      return this.getCollection(uuid,url,breadcrumbKey);
    } else {
      return this.getItem(uuid,url,breadcrumbKey);
    }
  }


  /**
   * Method for resolving breadcrumb array of an item of type Item
   * @param {uuid} route The current uuid of the item
   * @param {url} The current route url
   * @param {breadcrumbKey} The breadcrumbKey to insert as a final breadcrumb in array
   * @returns Breadcrumbs array
   */
  getItem(uuid: string, url: string, breadcrumbKey: string): Observable<Breadcrumb[]> {
    const statistics = new Breadcrumb(this.translate.instant(breadcrumbKey), url);

    return this.itemDataService.findById(uuid, true, false, ...this.followLinks).pipe(
      getFirstCompletedRemoteData(),
      getRemoteDataPayload(),
      map((object: Item) => {
        if (hasValue(object)) {
          const label = this.dsoNameService.getName(object);

          let crumb = new Breadcrumb(breadcrumbKey, url);
          crumb = new Breadcrumb(label, getItemPageRoute(object));

          return [crumb,statistics];
        } else {
          return [];
        }
      })
    );
  }

  /**
   * Method for resolving breadcrumb config of an item of type Community
   * @param {uuid} route The current uuid of the item
   * @param {url} The current route url
   * @param {breadcrumbKey} The breadcrumbKey to insert as a final breadcrumb in array
   * @returns Breadcrumbs array
   */
  getCommunity(uuid: string, url: string, breadcrumbKey: string): Observable<Breadcrumb[]> {

    const statistics = new Breadcrumb(this.translate.instant(breadcrumbKey), url);

    return this.communityService.findById(uuid, true, false).pipe(
      getFirstCompletedRemoteData(),
      getRemoteDataPayload(),
      map((object: Community) => {
        if (hasValue(object)) {
          const label = this.dsoNameService.getName(object);

          let crumb = new Breadcrumb(breadcrumbKey, url);
          crumb = new Breadcrumb(label, getCommunityPageRoute(object.uuid));

          return [crumb,statistics];
        } else {
          return [];
        }
      })
    );
  }

  /**
   * Method for resolving breadcrumb config of an item of type Collection
   * @param {url} The current route url
   * @param {breadcrumbKey} The breadcrumbKey to insert as a final breadcrumb in array
   * @returns Breadcrumbs array
   */
  getCollection(uuid: string, url: string, breadcrumbKey: string): Observable<Breadcrumb[]> {

    const statistics = new Breadcrumb(this.translate.instant(breadcrumbKey), url);

    return this.collectionService.findById(uuid, true, false).pipe(
      getFirstCompletedRemoteData(),
      getRemoteDataPayload(),
      map((object: Collection) => {
        if (hasValue(object)) {
          const label = this.dsoNameService.getName(object);

          let crumb = new Breadcrumb(breadcrumbKey, url);
          crumb = new Breadcrumb(label, getCollectionPageRoute(object.uuid));

          return [crumb,statistics];
        } else {
          return [];
        }
      })
    );
  }

  /**
   * Method that returns the follow links to already resolve
   * The self links defined in this list are expected to be requested somewhere in the near future
   * Requesting them as embeds will limit the number of requests
   */
  get followLinks(): FollowLinkConfig<Item>[] {
    return getItemPageLinksToFollow();
  }
}
