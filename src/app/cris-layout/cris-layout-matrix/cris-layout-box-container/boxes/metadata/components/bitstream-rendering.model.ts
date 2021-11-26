import { Observable } from 'rxjs';
import { Bitstream } from '../../../../../../core/shared/bitstream.model';
import { hasValue } from '../../../../../../shared/empty.util';
import { getAllSucceededRemoteDataPayload } from '../../../../../../core/shared/operators';
import { map } from 'rxjs/operators';
import { BitstreamDataService } from '../../../../../../core/data/bitstream-data.service';
import { TranslateService } from '@ngx-translate/core';
import { Inject, Optional } from '@angular/core';
import { Item } from '../../../../../../core/shared/item.model';
import { RenderingTypeValueModelComponent } from './rendering-type-value.model';
import { LayoutField } from '../../../../../../core/layout/models/box.model';

/**
 * This class defines the basic model to extends for create a new
 * bitstream field render component
 */
export class BitstreamRenderingModel extends RenderingTypeValueModelComponent {

  private TITLE_METADATA = 'dc.title';
  private SOURCE_METADATA = 'dc.source';
  private TYPE_METADATA = 'dc.type';

  constructor(
    @Inject('fieldProvider') public fieldProvider: LayoutField,
    @Inject('itemProvider') public itemProvider: Item,
    @Optional() @Inject('metadataValueProvider') public metadataValueProvider: any,
    @Inject('renderingSubTypeProvider') public renderingSubTypeProvider: string,
    protected bitstreamDataService: BitstreamDataService,
    protected translateService: TranslateService
  ) {
    super(fieldProvider, itemProvider, metadataValueProvider, renderingSubTypeProvider, translateService);
  }

  ngOnInit() {
    console.log(this.field);
  }

  getBitstream(): Observable<Bitstream[]> {
    return this.bitstreamDataService.findAllByItemAndBundleName(this.item, this.field.bitstream.bundle)
      .pipe(
        getAllSucceededRemoteDataPayload(),
        map((response) => {
          return response.page;
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

  getLink(bitstream: Bitstream): string {
    return bitstream._links.content.href;
  }
}
