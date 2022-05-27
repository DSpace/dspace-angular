import { Component, Inject, OnInit } from '@angular/core';

import { Observable, of as observableOf } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { FieldRenderingType, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { BitstreamRenderingModelComponent } from '../bitstream-rendering-model';
import { BitstreamDataService } from '../../../../../../../core/data/bitstream-data.service';
import { Bitstream } from '../../../../../../../core/shared/bitstream.model';
import { Item } from '../../../../../../../core/shared/item.model';
import { LayoutField } from '../../../../../../../core/layout/models/box.model';
import { map } from 'rxjs/operators';
import { hasValue, isEmpty, isNull } from 'src/app/shared/empty.util';
import { isUndefined } from 'lodash';


@Component({
  selector: 'ds-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.scss']
})
@MetadataBoxFieldRendering(FieldRenderingType.ATTACHMENT, true)
export class AttachmentComponent extends BitstreamRenderingModelComponent implements OnInit {

  bitstreams$: Observable<Bitstream[]>;

  constructor(
    @Inject('fieldProvider') public fieldProvider: LayoutField,
    @Inject('itemProvider') public itemProvider: Item,
    @Inject('renderingSubTypeProvider') public renderingSubTypeProvider: string,
    protected bitstreamDataService: BitstreamDataService,
    protected translateService: TranslateService
  ) {
    super(fieldProvider, itemProvider, renderingSubTypeProvider, bitstreamDataService, translateService);
  }

  ngOnInit() {
    this.bitstreams$ = this.getBitstreams()
      .pipe(
        map((bitstreams: Bitstream[]) => {
          // if metadata value is not specified show first attachment
          if (isUndefined(this.field.bitstream.metadataValue) || isNull(this.field.bitstream.metadataValue) || isEmpty(this.field.bitstream.metadataValue)) {
            if (!isEmpty(bitstreams)) {
              return [bitstreams[0]];
            }
          }

          // if metadata value is specified filter attachment from its metadat value
          let filteredBitstreams: Bitstream[] = bitstreams.filter((bitstream) => {
            const metadataValue = bitstream.firstMetadataValue(
              this.field.bitstream.metadataField
            );

            // if metadata value of the configuration has open and close clauses it is regex pattern
            if (this.field.bitstream.metadataValue.startsWith('(') && this.field.bitstream.metadataValue.endsWith(')')) {
              const pattern = new RegExp(this.field.bitstream.metadataValue);
              return !!metadataValue.match(pattern);
            } else {
              return metadataValue.toLowerCase() === this.field.bitstream.metadataValue.toLowerCase();
            }

          });

          // if there are bitsterams after filtering show them if not show the first attachment
          if (hasValue(filteredBitstreams) && !isEmpty(filteredBitstreams)) {
            return filteredBitstreams;
          } else if (hasValue(filteredBitstreams) && !isEmpty(bitstreams)) {
            return [bitstreams[0]];
          } else {
            return [];
          }

        })
      );
  }

}
