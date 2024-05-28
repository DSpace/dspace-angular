import { FindListOptions } from '../../../../../../core/data/find-list-options.model';
import { Component, Inject } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { Bitstream, ChecksumInfo } from '../../../../../../core/shared/bitstream.model';
import { hasValue, isNotEmpty } from '../../../../../../shared/empty.util';
import { getFirstCompletedRemoteData } from '../../../../../../core/shared/operators';
import { BitstreamDataService, MetadataFilter } from '../../../../../../core/data/bitstream-data.service';
import { Item } from '../../../../../../core/shared/item.model';
import { LayoutField } from '../../../../../../core/layout/models/box.model';
import { RenderingTypeStructuredModelComponent } from './rendering-type-structured.model';
import { buildPaginatedList, PaginatedList } from '../../../../../../core/data/paginated-list.model';
import { RemoteData } from '../../../../../../core/data/remote-data';
import { BitstreamFormat } from '../../../../../../core/shared/bitstream-format.model';
import { followLink } from '../../../../../../shared/utils/follow-link-config.model';

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

  constructor(
    @Inject('fieldProvider') public fieldProvider: LayoutField,
    @Inject('itemProvider') public itemProvider: Item,
    @Inject('renderingSubTypeProvider') public renderingSubTypeProvider: string,
    @Inject('tabNameProvider') public tabNameProvider: string,
    protected bitstreamDataService: BitstreamDataService,
    protected translateService: TranslateService
  ) {
    super(fieldProvider, itemProvider, renderingSubTypeProvider, tabNameProvider, translateService);
  }

  /**
   * Returns the list of original bitstreams according to BUNDLE configured in the rendering
   *
   * @param options The {@link FindListOptions} for the request
   */
  getBitstreams(options?: FindListOptions): Observable<PaginatedList<Bitstream>> {
    return this.bitstreamDataService
      .findAllByItemAndBundleName(this.item, this.field.bitstream.bundle, options, false, false, followLink('thumbnail'))
      .pipe(
        getFirstCompletedRemoteData(),
        map((response: RemoteData<PaginatedList<Bitstream>>) => {
          return response.hasSucceeded ? response.payload : buildPaginatedList(null, []);
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
  getChecksum(bitstream: Bitstream): ChecksumInfo {
    return bitstream.checkSum;
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
   * Returns the list of bitstreams according to BUNDLE configured in the rendering and filtering by the field configuration
   *
   * @param options The {@link FindListOptions} for the request
   */
  getBitstreamsByItem(options?: FindListOptions): Observable<PaginatedList<Bitstream>> {
    return this.bitstreamDataService
      .findByItem(
        this.item.uuid,
        this.field.bitstream.bundle,
        this.getMetadataFilters(),
        options,
        false,
        false,
        followLink('thumbnail')
      )
      .pipe(
        getFirstCompletedRemoteData(),
        map((response: RemoteData<PaginatedList<Bitstream>>) => {
          return response.hasSucceeded ? response.payload : buildPaginatedList(null, []);
        })
      );
  }

  /**
   * Composes the {@link MetadataFilter} array used as filter
   * while retrieving bitstream from remote services.
   *
   * @protected
   */
  protected getMetadataFilters(): MetadataFilter[] {
    let filters: MetadataFilter[] = [];
    if (isNotEmpty(this.field.bitstream.metadataValue)) {
      filters.push({
        metadataName: this.field.bitstream.metadataField,
        metadataValue: this.field.bitstream.metadataValue
      });
    }
    return filters;
  }

}
