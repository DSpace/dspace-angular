import { Component, Inject, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { FieldRenderingType, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { BitstreamRenderingModel } from '../bitstream-rendering.model';
import { BitstreamDataService } from '../../../../../../../core/data/bitstream-data.service';
import { Bitstream } from '../../../../../../../core/shared/bitstream.model';
import { LayoutField } from '../../../../../../../core/layout/models/metadata-component.model';
import { Item } from '../../../../../../../core/shared/item.model';

@Component({
  selector: 'ds-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.scss']
})
@MetadataBoxFieldRendering(FieldRenderingType.ATTACHMENT)
export class AttachmentComponent extends BitstreamRenderingModel implements OnInit {

  bitstreams$: Observable<Bitstream[]>;

  constructor(
    @Inject('fieldProvider') public fieldProvider: LayoutField,
    @Inject('itemProvider') public itemProvider: Item,
    @Inject('metadataValueProvider') public metadataValueProvider: any,
    @Inject('renderingSubTypeProvider') public renderingSubTypeProvider: string,
    protected bitstreamDataService: BitstreamDataService,
    protected translateService: TranslateService
  ) {
    super(fieldProvider, itemProvider, metadataValueProvider, renderingSubTypeProvider, bitstreamDataService, translateService);
  }

  ngOnInit() {
    this.bitstreams$ = this.getBitstream();
  }

}
