import { RenderingTypeModelComponent } from './rendering-type.model';
import { Observable } from 'rxjs';
import { Bitstream } from '../../../../core/shared/bitstream.model';
import { hasValue } from '../../../../shared/empty.util';
import { getAllSucceededRemoteDataPayload } from '../../../../core/shared/operators';
import { map } from 'rxjs/operators';
import { BitstreamDataService } from '../../../../core/data/bitstream-data.service';

/**
 * This class defines the basic model to extends for create a new
 * bitstream field render component
 */
export class BitstreamRenderingModel extends RenderingTypeModelComponent {

  private TITLE_METADATA = 'dc.title';
  private SOURCE_METADATA = 'dc.source';
  private TYPE_METADATA = 'dc.type';

  constructor(protected bitstreamDataService: BitstreamDataService) {
    super();
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
   * @param bistream
   */
  getType(bitstream: Bitstream): string {
    return bitstream.firstMetadataValue(this.TYPE_METADATA);
  }

  getLink(bitstream: Bitstream): string {
    return bitstream._links.content.href;
  }
}
