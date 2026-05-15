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
  AdvancedAttachmentElementType,
  AttachmentMetadataConfig,
} from '@dspace/config/advanced-attachment-rendering.config';
import {
  APP_CONFIG,
  AppConfig,
} from '@dspace/config/app-config.interface';
import { BitstreamDataService } from '@dspace/core/data/bitstream-data.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import {
  Bitstream,
  ChecksumInfo,
} from '@dspace/core/shared/bitstream.model';
import { BitstreamFormat } from '@dspace/core/shared/bitstream-format.model';
import { Item } from '@dspace/core/shared/item.model';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  BehaviorSubject,
  map,
  Observable,
  take,
} from 'rxjs';

import { ThemedThumbnailComponent } from '../../thumbnail/themed-thumbnail.component';
import { TruncatableComponent } from '../truncatable/truncatable.component';
import { TruncatablePartComponent } from '../truncatable/truncatable-part/truncatable-part.component';
import { FileSizePipe } from '../utils/file-size-pipe';
import { FileDownloadButtonComponent } from './attachment-render/types/file-download-button/file-download-button.component';


@Component({
  selector: 'ds-bitstream-attachment',
  templateUrl: './bitstream-attachment.component.html',
  styleUrls: ['./bitstream-attachment.component.scss'],
  imports: [
    AsyncPipe,
    FileDownloadButtonComponent,
    FileSizePipe,
    ThemedThumbnailComponent,
    TitleCasePipe,
    TranslateModule,
    TruncatableComponent,
    TruncatablePartComponent,
  ],
})
export class BitstreamAttachmentComponent implements OnInit {

  /**
   * Environment variables configuring the fields to be viewed
   */
  metadataConfig: AttachmentMetadataConfig[];

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
   * The item which the bitstream belongs to
   */
  @Input() item: Item;

  /**
   * The ID of the primary bitstream, used to display the Primary badge
   */
  @Input() primaryBitstreamId: string;

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

  /**
   * Configuration type enum
   */
  AdvancedAttachmentElementType = AdvancedAttachmentElementType;

  constructor(
    protected readonly bitstreamDataService: BitstreamDataService,
    protected readonly translateService: TranslateService,
    protected readonly router: Router,
    protected readonly route: ActivatedRoute,
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
  ) {
    this.metadataConfig = this.appConfig.layout.advancedAttachmentRendering.metadata;
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

  /**
   * Returns the size of given bitstreams in bytes
   * @param bitstream
   */
  getSize(bitstream: Bitstream): number {
    return bitstream.sizeBytes;
  }

  /**
   * Returns format of given bistream
   * @param bitstream
   */
  getFormat(bitstream: Bitstream): Observable<string> {
    return bitstream.format?.pipe(
      map((rd: RemoteData<BitstreamFormat>) => {
        return rd.payload?.shortDescription;
      }),
      take(1),
    );
  }

  /**
   * Returns the size of given bitstreams in bytes
   * @param bitstream
   */
  getChecksum(bitstream: Bitstream): ChecksumInfo {
    return bitstream.checkSum;
  }
}
