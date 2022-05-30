import { Component, Inject, OnInit } from '@angular/core';
import { concatMap, map, switchMap, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { FieldRenderingType, MetadataBoxFieldRendering } from '../metadata-box.decorator';
import { BitstreamDataService } from '../../../../../../../core/data/bitstream-data.service';
import { hasValue, isEmpty, isNull, isUndefined } from '../../../../../../../shared/empty.util';
import { Bitstream } from '../../../../../../../core/shared/bitstream.model';
import { BitstreamRenderingModelComponent } from '../bitstream-rendering-model';
import { Item } from '../../../../../../../core/shared/item.model';
import { LayoutField } from '../../../../../../../core/layout/models/box.model';
import { BehaviorSubject, combineLatest, of as observableOf } from 'rxjs';
import { getFirstCompletedRemoteData, getRemoteDataPayload } from 'src/app/core/shared/operators';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'span[ds-thumbnail].float-left',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.scss'],
})
@MetadataBoxFieldRendering(FieldRenderingType.THUMBNAIL, true)
export class ThumbnailComponent extends BitstreamRenderingModelComponent implements OnInit {
  bitstream$: BehaviorSubject<Bitstream> = new BehaviorSubject<Bitstream>(null);

  default: string;

  initialized: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  originalBitstreams: Bitstream[] = [];

  constructor(
    @Inject('fieldProvider') public fieldProvider: LayoutField,
    @Inject('itemProvider') public itemProvider: Item,
    @Inject('renderingSubTypeProvider') public renderingSubTypeProvider: string,
    protected bitstreamDataService: BitstreamDataService,
    protected translateService: TranslateService
  ) {
    super(
      fieldProvider,
      itemProvider,
      renderingSubTypeProvider,
      bitstreamDataService,
      translateService
    );
  }

  ngOnInit(): void {
    this.setDefaultImage();
    this.getOriginalBitstreams()
      .pipe(
        map((bitstreams: Bitstream[]) => {
          if (isUndefined(this.field.bitstream.metadataValue) || isNull(this.field.bitstream.metadataValue) || isEmpty(this.field.bitstream.metadataValue)) {
            return bitstreams;
          }

          return bitstreams.filter((bitstream) => {
            const metadataValue = bitstream.firstMetadataValue(
              this.field.bitstream.metadataField
            );
            return (
              hasValue(metadataValue) &&
              metadataValue.toLowerCase() === this.field.bitstream.metadataValue.toLowerCase()
            );
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
        //remove null values from array
        const thumbnails = bitstreams.filter(n => n);
        if (thumbnails.length > 0) {
          this.bitstream$.next(bitstreams[0]);
        } else if (isEmpty(thumbnails) && !isEmpty(this.originalBitstreams)) {
          this.bitstream$.next(this.originalBitstreams[0]);
        }
        this.initialized.next(true);
      });
  }

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
