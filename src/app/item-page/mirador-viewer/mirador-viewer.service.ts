import {
  Injectable,
  isDevMode,
} from '@angular/core';
import { Observable } from 'rxjs';
import {
  filter,
  last,
  map,
  mergeMap,
  switchMap,
} from 'rxjs/operators';

import { BitstreamDataService } from '../../core/data/bitstream-data.service';
import { BundleDataService } from '../../core/data/bundle-data.service';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { RemoteData } from '../../core/data/remote-data';
import { Bitstream } from '../../core/shared/bitstream.model';
import { BitstreamFormat } from '../../core/shared/bitstream-format.model';
import { Bundle } from '../../core/shared/bundle.model';
import { Item } from '../../core/shared/item.model';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import {
  followLink,
  FollowLinkConfig,
} from '../../shared/utils/follow-link-config.model';

@Injectable({ providedIn: 'root' })
export class MiradorViewerService {

  LINKS_TO_FOLLOW: FollowLinkConfig<Bitstream>[] = [
    followLink('format'),
  ];

  /**
   * Returns boolean to hide viewer when running in development mode.
   * Needed until it's possible to embed the viewer in development builds.
   */
  showEmbeddedViewer (): boolean {
    return !isDevMode();
  }

  /**
   * Returns observable of the number of images found in eligible IIIF bundles. Checks
   * the mimetype of the first 5 bitstreams in each bundle.
   * @param item
   * @param bitstreamDataService
   * @param bundleDataService
   * @returns the total image count
   */
  getImageCount(item: Item, bitstreamDataService: BitstreamDataService, bundleDataService: BundleDataService):
      Observable<number> {
    let count = 0;
    return bundleDataService.findAllByItem(item).pipe(
      getFirstCompletedRemoteData(),
      map((bundlesRD: RemoteData<PaginatedList<Bundle>>) => {
        return bundlesRD.payload;
      }),
      map((paginatedList: PaginatedList<Bundle>) => paginatedList.page),
      switchMap((bundles: Bundle[]) => bundles),
      filter((b: Bundle) => this.isIiifBundle(b.name)),
      mergeMap((bundle: Bundle) => {
        return bitstreamDataService.findAllByItemAndBundleName(item, bundle.name, {
          currentPage: 1,
          elementsPerPage: 5,
        }, true, true, ...this.LINKS_TO_FOLLOW).pipe(
          getFirstCompletedRemoteData(),
          map((bitstreamsRD: RemoteData<PaginatedList<Bitstream>>) => {
            return bitstreamsRD.payload;
          }),
          map((paginatedList: PaginatedList<Bitstream>) => paginatedList.page),
          switchMap((bitstreams: Bitstream[]) => bitstreams),
          switchMap((bitstream: Bitstream) => bitstream.format.pipe(
            getFirstCompletedRemoteData(),
            map((formatRD: RemoteData<BitstreamFormat>) => {
              return formatRD.payload;
            }),
            map((format: BitstreamFormat) => {
              if (format.mimetype.includes('image')) {
                count++;
              }
              return count;
            }),
          ),
          ),
        );
      }),
      last(),
    );
  }

  isIiifBundle(bundleName: string): boolean {
    return !(
      bundleName === 'OtherContent' ||
      bundleName === 'LICENSE' ||
      bundleName === 'THUMBNAIL' ||
      bundleName === 'TEXT' ||
      bundleName === 'METADATA' ||
      bundleName === 'CC-LICENSE' ||
      bundleName === 'BRANDED_PREVIEW'
    );
  }

}
