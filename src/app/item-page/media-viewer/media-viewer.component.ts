import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  combineLatest,
  forkJoin,
  Observable,
  of as observableOf,
  Subscription,
  switchMap,
} from 'rxjs';
import {
  filter,
  map,
  take,
} from 'rxjs/operators';

import { MediaViewerConfig } from '../../../config/media-viewer-config.interface';
import { environment } from '../../../environments/environment';
import { BitstreamDataService } from '../../core/data/bitstream-data.service';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../core/data/feature-authorization/feature-id';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { RemoteData } from '../../core/data/remote-data';
import { Bitstream } from '../../core/shared/bitstream.model';
import { BitstreamFormat } from '../../core/shared/bitstream-format.model';
import { Item } from '../../core/shared/item.model';
import { ItemRequest } from '../../core/shared/item-request.model';
import { MediaViewerItem } from '../../core/shared/media-viewer-item.model';
import { getFirstSucceededRemoteDataPayload } from '../../core/shared/operators';
import {
  hasValue,
  isNotEmpty,
} from '../../shared/empty.util';
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
    AsyncPipe,
    ThemedLoadingComponent,
    ThemedMediaViewerImageComponent,
    ThemedMediaViewerVideoComponent,
    ThemedThumbnailComponent,
    TranslateModule,
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

  itemRequest: ItemRequest;

  constructor(
    protected bitstreamDataService: BitstreamDataService,
    protected changeDetectorRef: ChangeDetectorRef,
    protected route: ActivatedRoute,
    private authorizationService: AuthorizationDataService,
  ) {
  }

  ngOnDestroy(): void {
    this.subs.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  /**
   * This method loads all the Bitstreams and Thumbnails and converts it to {@link MediaViewerItem}s
   */
  ngOnInit(): void {
    this.itemRequest = this.route.snapshot.data.itemRequest;
    const types: string[] = [
      ...(this.mediaOptions.image ? ['image'] : []),
      ...(this.mediaOptions.video ? ['audio', 'video'] : []),
    ];
    this.thumbnailsRD$ = this.loadRemoteData('THUMBNAIL');
    this.isLoading = true;

    const bitstreams$ = this.loadRemoteData('ORIGINAL').pipe(
      filter(rd => rd.hasSucceeded),
      map(rd => rd.payload.page),
    );

    const thumbnails$ = this.thumbnailsRD$.pipe(
      filter(rd => rd.hasSucceeded),
      map(rd => rd.payload.page),
    );

    this.subs.push(
      combineLatest([bitstreams$, thumbnails$]).pipe(
        switchMap(([bitstreams, thumbnails]) => {
          if (bitstreams.length === 0) {
            this.mediaList$.next([]);
            return observableOf([]);
          }

          const mediaObservables = bitstreams.map((bitstream, index) =>
            this.isAuthorized(bitstream).pipe(
              switchMap(isAuth => {
                if (!isAuth) {
                  return observableOf(null);
                }
                return bitstream.format.pipe(
                  getFirstSucceededRemoteDataPayload(),
                  map((format: BitstreamFormat) => {
                    const mediaItem = this.createMediaViewerItem(
                      bitstream,
                      format,
                      thumbnails[index],
                    );
                    return { mediaItem, format, bitstream };
                  }),
                );
              }),
            ),
          );
          return forkJoin(mediaObservables);
        }),
      ).subscribe(results => {
        const mediaItems = [];
        const captions = [];

        results.forEach(res => {
          if (res) {
            if (types.includes(res.mediaItem.format)) {
              mediaItems.push(res.mediaItem);
            } else if (res.format.mimetype === 'text/vtt') {
              captions.push(res.bitstream);
            }
          }
        });

        this.mediaList$.next(mediaItems);
        this.captions$.next(captions);
        this.isLoading = false;
        this.changeDetectorRef.detectChanges();
      }),
    );
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
    mediaItem.accessToken = this.accessToken;
    return mediaItem;
  }

  /**
   * Get access token, if this is accessed via a Request-a-Copy link
   */
  get accessToken() {
    if (hasValue(this.itemRequest) && this.itemRequest.accessToken && !this.itemRequest.accessExpired) {
      return this.itemRequest.accessToken;
    }
    return null;
  }

  /**
  * It checks if the Bitstream can be downloaded
  **/
  isAuthorized(file: Bitstream): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.CanDownload, isNotEmpty(file) ? file.self : undefined);
  }

}
