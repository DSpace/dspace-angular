import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  Bitstream,
  BitstreamDataService,
  BitstreamFormat,
  followLink,
  getFirstSucceededRemoteDataPayload,
  Item,
  MediaViewerConfig,
  MediaViewerItem,
  PaginatedList,
  RemoteData,
} from '@dspace/core';
import { hasValue } from '@dspace/shared/utils';
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

import { environment } from '../../../environments/environment';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
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
