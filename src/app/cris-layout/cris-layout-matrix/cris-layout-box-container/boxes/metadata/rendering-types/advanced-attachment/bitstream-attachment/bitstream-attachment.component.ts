import {
  AsyncPipe,
  NgFor,
  NgIf,
  TitleCasePipe,
} from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

import { AdvancedAttachmentElementType } from '../../../../../../../../../config/advanced-attachment-rendering.config';
import { environment } from '../../../../../../../../../environments/environment';
import { BitstreamDataService } from '../../../../../../../../core/data/bitstream-data.service';
import { LayoutField } from '../../../../../../../../core/layout/models/box.model';
import { Bitstream } from '../../../../../../../../core/shared/bitstream.model';
import { Item } from '../../../../../../../../core/shared/item.model';
import { TruncatableComponent } from '../../../../../../../../shared/truncatable/truncatable.component';
import { TruncatablePartComponent } from '../../../../../../../../shared/truncatable/truncatable-part/truncatable-part.component';
import { FileSizePipe } from '../../../../../../../../shared/utils/file-size-pipe';
import { ThemedThumbnailComponent } from '../../../../../../../../thumbnail/themed-thumbnail.component';
import { BitstreamRenderingModelComponent } from '../../bitstream-rendering-model';
import { AttachmentRenderComponent } from './attachment-render/attachment-render.component';
import { AttachmentRenderingType } from './attachment-type.decorator';

@Component({
  selector: 'ds-bitstream-attachment',
  templateUrl: './bitstream-attachment.component.html',
  styleUrls: ['./bitstream-attachment.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    ThemedThumbnailComponent,
    NgFor,
    AttachmentRenderComponent,
    TruncatableComponent,
    TruncatablePartComponent,
    AsyncPipe,
    TitleCasePipe,
    TranslateModule,
    FileSizePipe,
  ],
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

  /**
   * Attachment metadata to be displayed in title case
   */

  attachmentTypeMetadata = 'dc.type';

  @Input()
    attachment: Bitstream;

  constructor(
    @Inject('fieldProvider') public fieldProvider: LayoutField,
    @Inject('itemProvider') public itemProvider: Item,
    @Inject('renderingSubTypeProvider') public renderingSubTypeProvider: string,
    @Inject('tabNameProvider') public tabNameProvider: string,
    protected readonly bitstreamDataService: BitstreamDataService,
    protected readonly translateService: TranslateService,
    protected readonly router: Router,
    protected readonly route: ActivatedRoute,
  ) {
    super(fieldProvider, itemProvider, renderingSubTypeProvider, tabNameProvider, bitstreamDataService, translateService);
  }

  ngOnInit() {
    this.allAttachmentProviders = this.attachment?.allMetadataValues('bitstream.viewer.provider');
  }
}
