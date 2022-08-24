import { FindListOptions } from '../../../../../../core/data/request.models';
import { Component, Inject } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { Bitstream } from '../../../../../../core/shared/bitstream.model';
import { hasValue, isEmpty } from '../../../../../../shared/empty.util';
import { getFirstCompletedRemoteData } from '../../../../../../core/shared/operators';
import { BitstreamDataService } from '../../../../../../core/data/bitstream-data.service';
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
    protected bitstreamDataService: BitstreamDataService,
    protected translateService: TranslateService
  ) {
    super(fieldProvider, itemProvider, renderingSubTypeProvider, translateService);
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
   * Filter a list of bitstream according to "dc.type" metadata value
   *
   * @param bitstreams
   */
  filterBitstreamsByType(bitstreams: Bitstream[]): Bitstream[] {
    if (isEmpty(this.field.bitstream.metadataValue)) {
      return bitstreams;
    }

    return bitstreams.filter((bitstream) => {
      const metadataValue = bitstream.firstMetadataValue(
        this.field.bitstream.metadataField
      );

      // if metadata value of the configuration has open and close clauses it is regex pattern
      if (this.field.bitstream.metadataValue.startsWith('(') && this.field.bitstream.metadataValue.endsWith(')')) {
        let patternValueArr = this.field.bitstream.metadataValue.slice(1, -1).split('/');
        const pattern = new RegExp(patternValueArr[1], patternValueArr[3]);
        return hasValue(metadataValue) && !!metadataValue.match(pattern);
      } else {
        return hasValue(metadataValue) && metadataValue.toLowerCase() === this.field.bitstream.metadataValue.toLowerCase();
      }
    });
  }
}
