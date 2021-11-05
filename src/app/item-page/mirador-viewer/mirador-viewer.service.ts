import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Item } from '../../core/shared/item.model';
import { getFirstCompletedRemoteData, getFirstSucceededRemoteDataPayload } from '../../core/shared/operators';
import { last, map, switchMap } from 'rxjs/operators';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { Bitstream } from '../../core/shared/bitstream.model';
import { BitstreamFormat } from '../../core/shared/bitstream-format.model';
import { BitstreamDataService } from '../../core/data/bitstream-data.service';
import { followLink, FollowLinkConfig } from '../../shared/utils/follow-link-config.model';

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
   * Returns observable of the number of images in the ORIGINAL bundle
   * @param item
   * @param bitstreamDataService
   */
  getImageCount(item: Item, bitstreamDataService: BitstreamDataService): Observable<number> {
    let count = 0;
    return bitstreamDataService.findAllByItemAndBundleName(item, 'ORIGINAL', {
      currentPage: 1,
      elementsPerPage: 10
    }, true, true, ...this.LINKS_TO_FOLLOW)
      .pipe(
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
  }
}
