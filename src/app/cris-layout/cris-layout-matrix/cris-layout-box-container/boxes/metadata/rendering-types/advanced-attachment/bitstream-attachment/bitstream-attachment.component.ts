import {
  AsyncPipe,
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
import { Observable } from 'rxjs';

import { AdvancedAttachmentElementType } from '../../../../../../../../../config/advanced-attachment-rendering.config';
import { environment } from '../../../../../../../../../environments/environment';
import { BitstreamDataService } from '../../../../../../../../core/data/bitstream-data.service';
import { LayoutField } from '../../../../../../../../core/layout/models/box.model';
import {
  Bitstream,
  ChecksumInfo,
} from '../../../../../../../../core/shared/bitstream.model';
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
    ThemedThumbnailComponent,
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

  /**
   * Configuration type enum
   */
  AttachmentRenderingType = AttachmentRenderingType;

  /**
   * All item providers to show buttons of
   */
  allAttachmentProviders: string[] = [];

  /**
   * Attachment metadata to be displayed in title case
   */
  attachmentTypeMetadata = 'dc.type';

  /**
   * Attachment to be displayed
   */
  @Input() attachment: Bitstream;

  /**
   * Format of the bitstream
   */
  bitstreamFormat$: Observable<string>;

  /**
   * Size of the bitstream
   */
  bitstreamSize: number;
  /**
   * Checksum info of the bitstream
   */
  checksumInfo: ChecksumInfo;

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
    this.bitstreamFormat$ = this.getFormat(this.attachment);
    this.bitstreamSize = this.getSize(this.attachment);
    this.checksumInfo = this.getChecksum(this.attachment);
  }
}
