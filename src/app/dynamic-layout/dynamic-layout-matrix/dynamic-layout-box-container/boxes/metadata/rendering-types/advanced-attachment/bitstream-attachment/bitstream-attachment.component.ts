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
import { AdvancedAttachmentElementType } from '@dspace/config/advanced-attachment-rendering.config';
import {
  APP_CONFIG,
  AppConfig,
} from '@dspace/config/app-config.interface';
import { BitstreamDataService } from '@dspace/core/data/bitstream-data.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { LayoutField } from '@dspace/core/layout/models/box.model';
import {
  Bitstream,
  ChecksumInfo,
} from '@dspace/core/shared/bitstream.model';
import { Item } from '@dspace/core/shared/item.model';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  BehaviorSubject,
  Observable,
} from 'rxjs';

import { TruncatableComponent } from '../../../../../../../../shared/truncatable/truncatable.component';
import { TruncatablePartComponent } from '../../../../../../../../shared/truncatable/truncatable-part/truncatable-part.component';
import { FileSizePipe } from '../../../../../../../../shared/utils/file-size-pipe';
import { ThemedThumbnailComponent } from '../../../../../../../../thumbnail/themed-thumbnail.component';
import { BitstreamRenderingDirective } from '../../bitstream-rendering.directive';
import { AttachmentRenderComponent } from './attachment-render/attachment-render.component';
import { AttachmentRenderingType } from './attachment-type.decorator';

@Component({
  selector: 'ds-bitstream-attachment',
  templateUrl: './bitstream-attachment.component.html',
  styleUrls: ['./bitstream-attachment.component.scss'],
  imports: [
    AsyncPipe,
    AttachmentRenderComponent,
    FileSizePipe,
    ThemedThumbnailComponent,
    TitleCasePipe,
    TranslateModule,
    TruncatableComponent,
    TruncatablePartComponent,
  ],
})
export class BitstreamAttachmentComponent extends BitstreamRenderingDirective implements OnInit {

  /**
   * Environment variables configuring the fields to be viewed
   */
  envMetadata = this.appConfig.layout.advancedAttachmentRendering.metadata;

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

  thumbnail$: BehaviorSubject<RemoteData<Bitstream>> = new BehaviorSubject<RemoteData<Bitstream>>(null);

  constructor(
    @Inject('fieldProvider') public fieldProvider: LayoutField,
    @Inject('itemProvider') public itemProvider: Item,
    @Inject('renderingSubTypeProvider') public renderingSubTypeProvider: string,
    @Inject('tabNameProvider') public tabNameProvider: string,
    protected readonly bitstreamDataService: BitstreamDataService,
    protected readonly translateService: TranslateService,
    protected readonly router: Router,
    protected readonly route: ActivatedRoute,
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
  ) {
    super(fieldProvider, itemProvider, renderingSubTypeProvider, tabNameProvider, bitstreamDataService, translateService);
  }

  ngOnInit() {
    this.attachment.thumbnail.pipe(
      getFirstCompletedRemoteData(),
    ).subscribe((thumbnail: RemoteData<Bitstream>) => {
      this.thumbnail$.next(thumbnail);
    });
    this.allAttachmentProviders = this.attachment?.allMetadataValues('bitstream.viewer.provider');
    this.bitstreamFormat$ = this.getFormat(this.attachment);
    this.bitstreamSize = this.getSize(this.attachment);
    this.checksumInfo = this.getChecksum(this.attachment);
  }
}
