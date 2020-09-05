import { Component, OnInit } from '@angular/core';
import { MetadataBoxFieldRendering, FieldRendetingType } from '../metadata-box.decorator';
import { RenderingTypeModel } from '../rendering-type.model';
import { BitstreamDataService } from 'src/app/core/data/bitstream-data.service';
import { getAllSucceededRemoteDataPayload } from 'src/app/core/shared/operators';
import { map } from 'rxjs/operators';
import { hasValue } from 'src/app/shared/empty.util';
import { Observable } from 'rxjs';
import { Bitstream } from 'src/app/core/shared/bitstream.model';
import { BitstreamRenderingModel } from '../bitstream-rendering.model';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'span[ds-thumbnail].float-left',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.scss']
})
@MetadataBoxFieldRendering(FieldRendetingType.THUMBNAIL)
export class ThumbnailComponent extends BitstreamRenderingModel implements OnInit {

  bitstream$: Observable<Bitstream>;

  default: string;

  constructor(protected bitstreamDataService: BitstreamDataService) {
    super(bitstreamDataService);
  }

  ngOnInit(): void {
    this.setDefaultImage();
    this.bitstream$ = this.getBitstream().pipe(
      map((bitstreams) => {
        let rVal = null;
        bitstreams.forEach( (bitstream) => {
          const metadataValue = bitstream.firstMetadataValue(this.field.bitstream.metadataField);
          if (hasValue(metadataValue) && metadataValue === this.field.bitstream.metadataValue) {
            rVal = bitstream;
          }
        })
        return rVal;
      })
    );
  }

  setDefaultImage(): void {
    const eType = this.item.firstMetadataValue('relationship.type');
    this.default = 'assets/images/person-placeholder.svg'
    if (hasValue(eType) && eType.toUpperCase() === 'PROJECT') {
      this.default = 'assets/images/project-placeholder.svg';
    } else if (hasValue(eType) && eType.toUpperCase() === 'ORGUNIT') {
      this.default = 'assets/images/orgunit-placeholder.svg';
    }
  }
}
