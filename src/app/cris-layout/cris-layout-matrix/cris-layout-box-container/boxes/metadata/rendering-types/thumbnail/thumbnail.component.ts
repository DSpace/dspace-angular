import { Component, Inject, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { FieldRenderingType, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { BitstreamDataService } from '../../../../../../../core/data/bitstream-data.service';
import { hasValue } from '../../../../../../../shared/empty.util';
import { Bitstream } from '../../../../../../../core/shared/bitstream.model';
import { BitstreamRenderingModelComponent } from '../bitstream-rendering-model';
import { Item } from '../../../../../../../core/shared/item.model';
import { LayoutField } from '../../../../../../../core/layout/models/box.model';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'span[ds-thumbnail].float-left',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.scss']
})
@MetadataBoxFieldRendering(FieldRenderingType.THUMBNAIL, true)
export class ThumbnailComponent extends BitstreamRenderingModelComponent implements OnInit {

  bitstream$: Observable<Bitstream>;

  default: string;

  constructor(
    @Inject('fieldProvider') public fieldProvider: LayoutField,
    @Inject('itemProvider') public itemProvider: Item,
    @Inject('renderingSubTypeProvider') public renderingSubTypeProvider: string,
    protected bitstreamDataService: BitstreamDataService,
    protected translateService: TranslateService
  ) {
    super(fieldProvider, itemProvider, renderingSubTypeProvider, bitstreamDataService, translateService);
  }

  ngOnInit(): void {
    this.setDefaultImage();
    this.bitstream$ = this.getBitstream().pipe(
      map((bitstreams) => {
        let rVal = null;
        bitstreams.forEach((bitstream) => {
          const metadataValue = bitstream.firstMetadataValue(this.field.bitstream.metadataField);
          if (hasValue(metadataValue) && metadataValue === this.field.bitstream.metadataValue) {
            rVal = bitstream;
          }
        });
        return rVal;
      })
    );
  }

  setDefaultImage(): void {
    const eType = this.item.firstMetadataValue('dspace.entity.type');
    this.default = 'assets/images/person-placeholder.svg';
    if (hasValue(eType) && eType.toUpperCase() === 'PROJECT') {
      this.default = 'assets/images/project-placeholder.svg';
    } else if (hasValue(eType) && eType.toUpperCase() === 'ORGUNIT') {
      this.default = 'assets/images/orgunit-placeholder.svg';
    }
  }
}
