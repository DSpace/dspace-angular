import { Component, Inject, Input, OnInit } from '@angular/core';
import { Bitstream } from '../../../../../../../../core/shared/bitstream.model';
import { environment } from '../../../../../../../../../environments/environment';
import { AdvancedAttachmentElementType } from '../../../../../../../../../config/advanced-attachment-rendering.config';
import { BitstreamRenderingModelComponent } from '../../bitstream-rendering-model';
import { LayoutField } from '../../../../../../../../core/layout/models/box.model';
import { Item } from '../../../../../../../../core/shared/item.model';
import { BitstreamDataService } from '../../../../../../../../core/data/bitstream-data.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AttachmentRenderingType } from './attachment-type.decorator';

@Component({
  selector: 'ds-bitstream-attachment',
  templateUrl: './bitstream-attachment.component.html',
  styleUrls: ['./bitstream-attachment.component.scss']
})
export class BitstreamAttachmentComponent extends BitstreamRenderingModelComponent implements OnInit {

  /**
   * Environment variables configuring the fields to be viewed
   */
  envMetadata = environment.advancedAttachmentRendering.metadata;

  /**
   * Configuration type enum
   */
  AdvancedAttachmentElementType = AdvancedAttachmentElementType;

  AttachmentRenderingType = AttachmentRenderingType;

  /**
   * All item providers to show buttons of
   */
  allAttachmentProviders: string[] = [];

  @Input()
  attachment: Bitstream;

  constructor(
    @Inject('fieldProvider') public fieldProvider: LayoutField,
    @Inject('itemProvider') public itemProvider: Item,
    @Inject('renderingSubTypeProvider') public renderingSubTypeProvider: string,
    protected readonly bitstreamDataService: BitstreamDataService,
    protected readonly translateService: TranslateService,
    protected readonly router: Router,
    protected readonly route: ActivatedRoute,
  ) {
    super(fieldProvider, itemProvider, renderingSubTypeProvider, bitstreamDataService, translateService);
  }

  ngOnInit() {
    this.allAttachmentProviders = this.attachment?.allMetadataValues('bitstream.viewer.provider');
  }
}
