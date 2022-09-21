import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../../core/shared/item.model';
import { getFirstCompletedRemoteData, getFirstSucceededRemoteDataPayload } from '../../core/shared/operators';
import { filter, last, map, switchMap } from 'rxjs/operators';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { Bitstream } from '../../core/shared/bitstream.model';
import { BitstreamFormat } from '../../core/shared/bitstream-format.model';
import { BitstreamDataService } from '../../core/data/bitstream-data.service';
import { followLink, FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { Bundle } from '../../core/shared/bundle.model';
import { BundleDataService } from '../../core/data/bundle-data.service';

@Injectable()
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
   * Returns observable of the number of images found in eligible IIIF bundles. This checks
   * only the first 5 bitstreams in each bundle since any count greater than one is
   * enough to set the IIIF viewer to use the "multi" image layout.
   * @param item
   * @param bitstreamDataService
   * @param bundleDataService
   */
  getImageCount(item: Item, bitstreamDataService: BitstreamDataService, bundleDataService: BundleDataService):
    Observable<number> {
    let count = 0;
    return bundleDataService.findAllByItem(item).pipe(
      getFirstCompletedRemoteData(),
      map((bundlesRD: RemoteData<PaginatedList<Bundle>>) => bundlesRD.payload),
      map((paginatedList: PaginatedList<Bundle>) => paginatedList.page),
      switchMap((bundles: Bundle[]) => bundles),
      filter((b: Bundle) => this.isIiifBundle(b.name)),
      switchMap((bundle: Bundle) => {
        return bitstreamDataService.findAllByItemAndBundleName(item, bundle.name, {
          currentPage: 1,
          elementsPerPage: 5
        }, true, true, ...this.LINKS_TO_FOLLOW).pipe(
          getFirstCompletedRemoteData(),
          map((bitstreamsRD: RemoteData<PaginatedList<Bitstream>>) => bitstreamsRD.payload),
          map((paginatedList: PaginatedList<Bitstream>) => paginatedList.page),
          switchMap((bitstreams: Bitstream[]) => bitstreams),
          switchMap((bitstream: Bitstream) => bitstream.format.pipe(
            getFirstSucceededRemoteDataPayload(),
            map((format: BitstreamFormat) => format)
          )),
          map((format: BitstreamFormat) => {
            if (format.mimetype.includes('image')) {
              count++;
            }
            return count;
          }),
          last()
        );
      }));
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
