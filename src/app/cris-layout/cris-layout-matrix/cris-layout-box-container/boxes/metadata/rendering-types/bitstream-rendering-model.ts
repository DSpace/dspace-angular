import { FindListOptions } from '../../../../../../core/data/request.models';
import { Component, Inject } from '@angular/core';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { Bitstream } from '../../../../../../core/shared/bitstream.model';
import { hasValue } from '../../../../../../shared/empty.util';
import { getFirstCompletedRemoteData } from '../../../../../../core/shared/operators';
import { BitstreamDataService } from '../../../../../../core/data/bitstream-data.service';
import { Item } from '../../../../../../core/shared/item.model';
import { LayoutField } from '../../../../../../core/layout/models/box.model';
import { RenderingTypeStructuredModelComponent } from './rendering-type-structured.model';
import { PaginatedList } from '../../../../../../core/data/paginated-list.model';
import { RemoteData } from '../../../../../../core/data/remote-data';
import { BitstreamFormat } from 'src/app/core/shared/bitstream-format.model';
import { followLink } from 'src/app/shared/utils/follow-link-config.model';


/**
 * This class defines the basic model to extends for create a new
 * bitstream field render component
 */
@Component({
  template: ''
})
export abstract class BitstreamRenderingModelComponent extends RenderingTypeStructuredModelComponent {

  private TITLE_METADATA = 'dc.title';
  private SOURCE_METADATA = 'dc.source';
  private TYPE_METADATA = 'dc.type';
  private DESCRIPTION_METADATA = 'dc.description';


  /**
   * List of all bitstreams that belong to the item
   */
  allBitstreams$: BehaviorSubject<Bitstream[]> = new BehaviorSubject<Bitstream[]>([]);

  /**
   * Pagination configuration object
   */
  pageOptions: FindListOptions;

  /**
   * If the list should show view more button
   */
  canViewMore = false;

  /**
  * Total number of pages available
  */
  totalPages: number = null;

  constructor(
    @Inject('fieldProvider') public fieldProvider: LayoutField,
    @Inject('itemProvider') public itemProvider: Item,
    @Inject('renderingSubTypeProvider') public renderingSubTypeProvider: string,
    protected bitstreamDataService: BitstreamDataService,
    protected translateService: TranslateService
  ) {
    super(fieldProvider, itemProvider, renderingSubTypeProvider, translateService);
  }

  /** If there is available any THUMBNAIL/PREVIEW bundle use one of them,
   *  otherwise the ORIGINAL bundle(the default value)
   */
  getBitstreams(): Observable<Bitstream[]> {
    const thumbnailRequest = this.bitstreamDataService
      .findAllByItemAndBundleName(this.item, 'THUMBNAIL')
      .pipe(
        getFirstCompletedRemoteData(),
        map((response: RemoteData<PaginatedList<Bitstream>>) => {
          {
            return response.hasSucceeded ? response.payload.page : [];
          }
        })
      );

    const previewRequest = this.bitstreamDataService
      .findAllByItemAndBundleName(this.item, 'PREVIEW')
      .pipe(
        getFirstCompletedRemoteData(),
        map((response: RemoteData<PaginatedList<Bitstream>>) => {
          {
            return response.hasSucceeded ? response.payload.page : [];
          }
        }),
        switchMap((previewRes: Bitstream[]) => {
          if (previewRes.length === 0) {
            return originalRequest;
          }
          return of(previewRes);
        })
      );

    const originalRequest = this.bitstreamDataService
      .findAllByItemAndBundleName(this.item, this.field.bitstream.bundle)
      .pipe(
        getFirstCompletedRemoteData(),
        map((response: RemoteData<PaginatedList<Bitstream>>) => {
          return response.hasSucceeded ? response.payload.page : [];
        })
      );

    return thumbnailRequest.pipe(
      switchMap((thumbnailRes: Bitstream[]) => {
        if (thumbnailRes.length === 0) {
          return previewRequest;
        }
        return of(thumbnailRes);
      })
    );
  }


  /**
   * Returns the list of original bitstreams
   */
  getOriginalBitstreams(): Observable<Bitstream[]> {
    return this.bitstreamDataService
      .findAllByItemAndBundleName(this.item, this.field.bitstream.bundle, {}, false, false, followLink('thumbnail'))
      .pipe(
        getFirstCompletedRemoteData(),
        map((response: RemoteData<PaginatedList<Bitstream>>) => {
          return response.hasSucceeded ? response.payload.page : [];
        })
      );
  }

  /**
   * Returns the filename of given bitstream
   * @param bitstream
   */
  fileName(bitstream: Bitstream): string {
    const title = bitstream.firstMetadataValue(this.TITLE_METADATA);
    return hasValue(title) ? title : bitstream.firstMetadataValue(this.SOURCE_METADATA);
  }

  /**
   * Returns the size of given bitstreams in bytes
   * @param bitstream
   */
  getSize(bitstream: Bitstream): number {
    return bitstream.sizeBytes;
  }

  /**
   * Returns type of given bistream
   * @param bitstream
   */
  getType(bitstream: Bitstream): string {
    return bitstream.firstMetadataValue(this.TYPE_METADATA);
  }

  /**
   * Returns link of given bistream
   * @param bitstream
   */
  getLink(bitstream: Bitstream): string {
    return bitstream._links.content.href;
  }

  /**
   * Returns format of given bistream
   * @param bitstream
   */
  getFormat(bitstream: Bitstream): Observable<string> {
    return bitstream.format?.pipe(
      map((rd: RemoteData<BitstreamFormat>) => {
        return rd.payload?.shortDescription;
      })
    );
  }

  /**
   * Returns description of given bistream
   * @param bitstream
   */
  getDescription(bitstream: Bitstream): string {
    return bitstream.firstMetadataValue(this.DESCRIPTION_METADATA);
  }


  /**
   * Start the list with pagination configuration
   */
  startWithPagination() {
    this.getBitstreams().subscribe((bitstreams: Bitstream[]) => {
      this.allBitstreams$.next(bitstreams);
      this.totalPages = Math.ceil((bitstreams.length - 1) / this.pageOptions.elementsPerPage);
      if (this.totalPages > 1) {
        this.canViewMore = true;
      }
    });
  }

  /**
   * Get the list of paginated bitstreams that will be shown
   */
  getPaginatedBitstreams(): Observable<Bitstream[]> {
    return this.allBitstreams$.pipe(
      map((bitstreams: Bitstream[]) => {
        return bitstreams.filter((bitstream: Bitstream, index) => {
          return index < this.pageOptions.elementsPerPage * this.pageOptions.currentPage;
        });
      })
    );
  }

  /**
   * When view more is clicked show the next page and check if shold show view more button
   */
  viewMore() {
    this.pageOptions.currentPage++;
    this.allBitstreams$.next(this.allBitstreams$.getValue());
    if (this.pageOptions.currentPage === this.totalPages) {
      this.canViewMore = false;
    }
  }


}
