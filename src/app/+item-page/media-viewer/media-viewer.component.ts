import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, takeWhile } from 'rxjs/operators';
import { BitstreamDataService } from '../../core/data/bitstream-data.service';
import { BitstreamFormatDataService } from '../../core/data/bitstream-format-data.service';
import { PaginatedList } from '../../core/data/paginated-list';
import { RemoteData } from '../../core/data/remote-data';
import { Bitstream } from '../../core/shared/bitstream.model';
import { Item } from '../../core/shared/item.model';
import { MediaViewerItem } from '../../core/shared/media-viewer-item.model';
import { getFirstSucceededRemoteDataPayload } from '../../core/shared/operators';
import { hasNoValue, hasValue } from '../../shared/empty.util';

@Component({
  selector: 'ds-media-viewer',
  templateUrl: './media-viewer.component.html',
  styleUrls: ['./media-viewer.component.scss'],
})
export class MediaViewerComponent implements OnInit {
  @Input() item: Item;

  mediaList$: BehaviorSubject<MediaViewerItem[]>;

  isLoading: boolean;

  constructor(
    protected bitstreamDataService: BitstreamDataService,
    protected bitstreamFormatDataService: BitstreamFormatDataService
  ) {}

  ngOnInit(): void {
    this.mediaList$ = new BehaviorSubject([]);
    this.isLoading = true;

    this.loadRemoteData('ORIGINAL').subscribe((bitstreamsRD) => {
      console.log(bitstreamsRD);
      this.loadRemoteData('THUMBNAIL').subscribe((thumbnailsRD) => {
        for (let index = 0; index < bitstreamsRD.payload.page.length; index++) {
          this.bitstreamFormatDataService
            .findByBitstream(bitstreamsRD.payload.page[index])
            .pipe(getFirstSucceededRemoteDataPayload())
            .subscribe((format) => {
              const current = this.mediaList$.getValue();
              const mediaItem = new MediaViewerItem();
              mediaItem.bitstream = bitstreamsRD.payload.page[index];
              mediaItem.format = format.mimetype.split('/')[0];
              mediaItem.thumbnail =
                thumbnailsRD.payload && thumbnailsRD.payload.page[index]
                  ? thumbnailsRD.payload.page[index]._links.content.href
                  : null;
              this.mediaList$.next([...current, mediaItem]);
            });
        }
        this.isLoading = false;
      });
    });
  }

  loadRemoteData(
    bundleName: string
  ): Observable<RemoteData<PaginatedList<Bitstream>>> {
    return this.bitstreamDataService
      .findAllByItemAndBundleName(this.item, bundleName)
      .pipe(
        filter((bitstreamsRD: RemoteData<PaginatedList<Bitstream>>) =>
          hasValue(bitstreamsRD)
        ),
        takeWhile(
          (bitstreamsRD_1: RemoteData<PaginatedList<Bitstream>>) =>
            hasNoValue(bitstreamsRD_1.payload) &&
            hasNoValue(bitstreamsRD_1.error),
          true
        )
      );
  }
}
