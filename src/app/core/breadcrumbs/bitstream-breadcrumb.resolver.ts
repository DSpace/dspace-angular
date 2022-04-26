import { Injectable } from '@angular/core';
import { DSOBreadcrumbsService } from './dso-breadcrumbs.service';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { Bitstream } from '../shared/bitstream.model';
import { BitstreamDataService } from '../data/bitstream-data.service';
import { BITSTREAM_PAGE_LINKS_TO_FOLLOW, BUNDLE_PAGE_LINKS_TO_FOLLOW } from 'src/app/bitstream-page/bitstream-page.resolver';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { BreadcrumbConfig } from 'src/app/breadcrumbs/breadcrumb/breadcrumb-config.model';
import { getFirstCompletedRemoteData, getRemoteDataPayload } from '../shared/operators';
import { map } from 'rxjs/operators';
import { hasValue } from 'src/app/shared/empty.util';
import { DSOBreadcrumbResolver } from './dso-breadcrumb.resolver';
import { BundleDataService } from '../data/bundle-data.service';
import { Bundle } from '../shared/bundle.model';
import { ItemDataService } from '../data/item-data.service';
import { Item } from '../shared/item.model';
import { ITEM_PAGE_LINKS_TO_FOLLOW } from 'src/app/item-page/item.resolver';

/**
 * The class that resolves the BreadcrumbConfig object for an Item
 */
@Injectable({
  providedIn: 'root'
})
export class BitstreamBreadcrumbResolver extends DSOBreadcrumbResolver<Bitstream> {
  constructor(protected breadcrumbService: DSOBreadcrumbsService, protected dataService: BitstreamDataService, protected itemService: ItemDataService) {
    super(breadcrumbService, dataService);
  }

  /**
   * Method for resolving a breadcrumb config object
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns BitstreamBreadcrumbConfig object
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BreadcrumbConfig<Bitstream>> {
    const uuid = route.params.id;
    return this.dataService.findById(uuid, true, false, ...this.followLinks).pipe(
      getFirstCompletedRemoteData(),
      getRemoteDataPayload(),
      map((object: Bitstream) => {
        if (hasValue(object)) {
          object.bundle.pipe(
            getFirstCompletedRemoteData(),
            getRemoteDataPayload()
          ).subscribe(res => {
            this.itemService.findById(res.uuid, true, false, ...this.bfollowLinks).pipe(
              getFirstCompletedRemoteData(),
              getRemoteDataPayload()
            ).subscribe(bres => {
              console.log(bres);
            });
            const url = res._links.item.href;
            return {provider: this.breadcrumbService, key: of(res), url: url};
          });
        } else {
          return undefined;
        }
      })
    );
  }

  /**
   * Method that returns the follow links to already resolve
   * The self links defined in this list are expected to be requested somewhere in the near future
   * Requesting them as embeds will limit the number of requests
   */
  get followLinks(): FollowLinkConfig<Bitstream>[] {
    return BITSTREAM_PAGE_LINKS_TO_FOLLOW;
  }

  get bfollowLinks(): FollowLinkConfig<Item>[] {
    return ITEM_PAGE_LINKS_TO_FOLLOW;
  }
}
