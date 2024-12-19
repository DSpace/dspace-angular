import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  Observable,
  Subscription,
} from 'rxjs';
import {
  filter,
  take,
} from 'rxjs/operators';

import { MediaViewerConfig } from '../../../config/media-viewer-config.interface';
import { environment } from '../../../environments/environment';
import { BitstreamDataService } from '../../core/data/bitstream-data.service';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { RemoteData } from '../../core/data/remote-data';
import { Bitstream } from '../../core/shared/bitstream.model';
import { BitstreamFormat } from '../../core/shared/bitstream-format.model';
import { Item } from '../../core/shared/item.model';
import { MediaViewerItem } from '../../core/shared/media-viewer-item.model';
import { getFirstSucceededRemoteDataPayload } from '../../core/shared/operators';
import { hasValue } from '../../shared/empty.util';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { followLink } from '../../shared/utils/follow-link-config.model';
import { VarDirective } from '../../shared/utils/var.directive';
import { ThemedThumbnailComponent } from '../../thumbnail/themed-thumbnail.component';
import { ThemedMediaViewerImageComponent } from './media-viewer-image/themed-media-viewer-image.component';
import { ThemedMediaViewerVideoComponent } from './media-viewer-video/themed-media-viewer-video.component';

/**
 * This component renders the media viewers
 */
@Component({
  selector: 'ds-base-media-viewer',
  templateUrl: './media-viewer.component.html',
  styleUrls: ['./media-viewer.component.scss'],
  imports: [
    ThemedMediaViewerImageComponent,
    ThemedThumbnailComponent,
    AsyncPipe,
    NgIf,
    ThemedMediaViewerVideoComponent,
    TranslateModule,
    ThemedLoadingComponent,
    VarDirective,
  ],
  standalone: true,
})
export class MediaViewerComponent implements OnDestroy, OnInit {
  @Input() item: Item;

  @Input() mediaOptions: MediaViewerConfig = environment.mediaViewer;

  mediaList$: BehaviorSubject<MediaViewerItem[]> = new BehaviorSubject([]);

  captions$: BehaviorSubject<Bitstream[]> = new BehaviorSubject([]);

  isLoading = true;

  thumbnailPlaceholder = './assets/images/replacement_document.svg';

  thumbnailsRD$: Observable<RemoteData<PaginatedList<Bitstream>>>;

  subs: Subscription[] = [];

  constructor(
    protected bitstreamDataService: BitstreamDataService,
    protected changeDetectorRef: ChangeDetectorRef,
  ) {
  }

  ngOnDestroy(): void {
    this.subs.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  /**
   * This method loads all the Bitstreams and Thumbnails and converts it to {@link MediaViewerItem}s
   */
  ngOnInit(): void {
    const types: string[] = [
      ...(this.mediaOptions.image ? ['image'] : []),
      ...(this.mediaOptions.video ? ['audio', 'video'] : []),
    ];
    this.thumbnailsRD$ = this.loadRemoteData('THUMBNAIL');
    this.subs.push(this.loadRemoteData('ORIGINAL').subscribe((bitstreamsRD: RemoteData<PaginatedList<Bitstream>>) => {
      if (bitstreamsRD.payload.page.length === 0) {
        this.isLoading = false;
        this.mediaList$.next([]);
      } else {
        this.subs.push(this.thumbnailsRD$.subscribe((thumbnailsRD: RemoteData<PaginatedList<Bitstream>>) => {
          for (
            let index = 0;
            index < bitstreamsRD.payload.page.length;
            index++
          ) {
            this.subs.push(bitstreamsRD.payload.page[index].format
              .pipe(getFirstSucceededRemoteDataPayload())
              .subscribe((format: BitstreamFormat) => {
                const mediaItem = this.createMediaViewerItem(
                  bitstreamsRD.payload.page[index],
                  format,
                  thumbnailsRD.payload && thumbnailsRD.payload.page[index],
                );
                if (types.includes(mediaItem.format)) {
                  this.mediaList$.next([...this.mediaList$.getValue(), mediaItem]);
                } else if (format.mimetype === 'text/vtt') {
                  this.captions$.next([...this.captions$.getValue(), bitstreamsRD.payload.page[index]]);
                }
              }));
          }
          this.isLoading = false;
          this.changeDetectorRef.detectChanges();
        }));
      }
    }));
  }

  /**
   * This method will retrieve the next page of Bitstreams from the external BitstreamDataService call.
   * @param bundleName Bundle name
   */
  loadRemoteData(
    bundleName: string,
  ): Observable<RemoteData<PaginatedList<Bitstream>>> {
    return this.bitstreamDataService
      .findAllByItemAndBundleName(
        this.item,
        bundleName,
        {},
        true,
        true,
        followLink('format'),
      )
      .pipe(
        filter(
          (bitstreamsRD: RemoteData<PaginatedList<Bitstream>>) =>
            hasValue(bitstreamsRD) &&
            (hasValue(bitstreamsRD.errorMessage) || hasValue(bitstreamsRD.payload)),
        ),
        take(1),
      );
  }

  /**
   * This method creates a {@link MediaViewerItem} from incoming {@link Bitstream}s
   * @param original original bitstream
   * @param format original bitstream format
   * @param thumbnail thumbnail bitstream
   */
  createMediaViewerItem(original: Bitstream, format: BitstreamFormat, thumbnail: Bitstream): MediaViewerItem {
    const mediaItem = new MediaViewerItem();
    mediaItem.bitstream = original;
    mediaItem.format = format.mimetype.split('/')[0];
    mediaItem.mimetype = format.mimetype;
    mediaItem.thumbnail = thumbnail ? thumbnail._links.content.href : null;
    return mediaItem;
  }
}
