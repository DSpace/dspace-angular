import { ConfigurationProperty } from './../../../../../../../core/shared/configuration-property.model';
import { RemoteData } from './../../../../../../../core/data/remote-data';
import { ThumbnailService } from './../../../../../../../shared/thumbnail/thumbnail.service';
import { Component, Inject, OnInit } from '@angular/core';
import { concatMap, map, switchMap, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { FieldRenderingType, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { BitstreamDataService } from '../../../../../../../core/data/bitstream-data.service';
import { hasValue, isEmpty, isNotNull, isNull, isUndefined } from '../../../../../../../shared/empty.util';
import { Bitstream } from '../../../../../../../core/shared/bitstream.model';
import { BitstreamRenderingModelComponent } from '../bitstream-rendering-model';
import { Item } from '../../../../../../../core/shared/item.model';
import { LayoutField } from '../../../../../../../core/layout/models/box.model';
import { BehaviorSubject, combineLatest, of as observableOf } from 'rxjs';
import { getFirstCompletedRemoteData, getRemoteDataPayload } from '../../../../../../../core/shared/operators';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'span[ds-thumbnail].float-left',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.scss']
})
@MetadataBoxFieldRendering(FieldRenderingType.THUMBNAIL, true)
/**
 * The component for displaying a thumbnail rendered metadata box
 */
export class ThumbnailComponent extends BitstreamRenderingModelComponent implements OnInit {

  /**
  * The bitstream to be rendered
  */
  bitstream$: BehaviorSubject<Bitstream> = new BehaviorSubject<Bitstream>(null);

  /**
  * Default image to be shown in the thumbnail
  */
  default: string;

  /**
  * Item rendering initialization state
  */
  initialized: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Original bitstreams of the item
   */
  originalBitstreams: Bitstream[] = [];

  /**
  * Maximum size of the thumbnail allowed to be shown
  */
  maxSize: number;

  constructor(
    @Inject('fieldProvider') public fieldProvider: LayoutField,
    @Inject('itemProvider') public itemProvider: Item,
    @Inject('renderingSubTypeProvider') public renderingSubTypeProvider: string,
    protected bitstreamDataService: BitstreamDataService,
    protected translateService: TranslateService,
    protected thumbnailService: ThumbnailService
  ) {
    super(fieldProvider, itemProvider, renderingSubTypeProvider, bitstreamDataService, translateService);
  }

  /**
  * On Initialization get thumbnail default & configuration and get the thumbnail infromation from api for this item
  */
  ngOnInit(): void {
    this.setDefaultImage();
    this.thumbnailService.getConfig().pipe(
      tap((remoteData: RemoteData<ConfigurationProperty>) => {
        // make sure we got a success response from the backend
        if (!remoteData.hasSucceeded) { return; }

        if (!isUndefined(remoteData.payload) && isNotNull(remoteData.payload) && isNotNull(remoteData.payload.values)) {
          this.maxSize = parseInt(remoteData.payload.values[0], 10);
        }

      }),
      switchMap(() => this.getOriginalBitstreams())
    )
      .pipe(
        map((bitstreams: Bitstream[]) => {
          if (isUndefined(this.field.bitstream.metadataValue) || isNull(this.field.bitstream.metadataValue) || isEmpty(this.field.bitstream.metadataValue)) {
            return bitstreams;
          }

          return bitstreams.filter((bitstream) => {
            const metadataValue = bitstream.firstMetadataValue(
              this.field.bitstream.metadataField
            );
            return hasValue(metadataValue) && metadataValue.toLowerCase() === this.field.bitstream.metadataValue.toLowerCase();
          });
        }),
        concatMap((bitstreams: Bitstream[]) => {
          if (isEmpty(bitstreams)) {
            return observableOf([]);
          }
          this.originalBitstreams = bitstreams;
          // get thumbnails observables if available if not return observable of null
          const observables = bitstreams.map((bitstream: Bitstream) => bitstream.thumbnail.pipe(
            getFirstCompletedRemoteData(),
            getRemoteDataPayload(),
          ) ?? observableOf(null));
          return combineLatest(...observables);
        })
      )
      .subscribe((bitstreams: Bitstream[]) => {
        //remove null values from array & filter byteSize
        let thumbnails = this.getFilteredBySize(bitstreams.filter(n => n));
        if (thumbnails.length > 0) {
          this.bitstream$.next(thumbnails[0]);
        } else if (isEmpty(thumbnails) && !isEmpty(this.originalBitstreams)) {
          const filteredBitstreams = this.getFilteredBySize(this.originalBitstreams);
          if (filteredBitstreams.length > 0) {
            this.bitstream$.next(filteredBitstreams[0]);
          }
        }
        this.initialized.next(true);
      });
  }

  /**
  * Filter bistreams by size
  */
  getFilteredBySize(bitstreams: Bitstream[]) {
    if (!isEmpty(this.maxSize)) {
      const filteredBitstreams = bitstreams.filter((bitstream: Bitstream) => {
        // max size is in KB so we need to multiply with 1000
        return bitstream.sizeBytes <= this.maxSize * 1000;
      });
      return filteredBitstreams;
    }

    return bitstreams;
  }

  /**
  * Set the default image src depending on item entity type
  */
  setDefaultImage(): void {
    const eType = this.item.firstMetadataValue('dspace.entity.type');
    this.default = 'assets/images/person-placeholder.svg';
    if (hasValue(eType) && eType.toUpperCase() === 'PROJECT') {
      this.default = 'assets/images/project-placeholder.svg';
    } else if (hasValue(eType) && eType.toUpperCase() === 'ORGUNIT') {
      this.default = 'assets/images/orgunit-placeholder.svg';
    }
  }
}
