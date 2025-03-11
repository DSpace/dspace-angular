import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  BehaviorSubject,
  of as observableOf,
} from 'rxjs';
import {
  map,
  switchMap,
} from 'rxjs/operators';

import { BitstreamDataService } from '../../../../../../../core/data/bitstream-data.service';
import { PaginatedList } from '../../../../../../../core/data/paginated-list.model';
import { LayoutField } from '../../../../../../../core/layout/models/box.model';
import { Bitstream } from '../../../../../../../core/shared/bitstream.model';
import { Item } from '../../../../../../../core/shared/item.model';
import { getFirstCompletedRemoteData } from '../../../../../../../core/shared/operators';
import {
  hasValue,
  isEmpty,
  isNotEmpty,
} from '../../../../../../../shared/empty.util';
import { ThemedThumbnailComponent } from '../../../../../../../thumbnail/themed-thumbnail.component';
import { BitstreamRenderingModelComponent } from '../bitstream-rendering-model';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector, dspace-angular-ts/themed-component-selectors
  selector: 'span[ds-thumbnail].float-left',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.scss'],
  standalone: true,
  imports: [
    ThemedThumbnailComponent,
    AsyncPipe,
    NgIf,
  ],
})
/**
 * The component for displaying a thumbnail rendered metadata box
 */
export class ThumbnailRenderingComponent extends BitstreamRenderingModelComponent implements OnInit {

  /**
   * The bitstream to be rendered
   */
  thumbnail$: BehaviorSubject<Bitstream> = new BehaviorSubject<Bitstream>(null);

  /**
   * Default image to be shown in the thumbnail
   */
  default: string;

  /**
   * Item rendering initialization state
   */
  initialized: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Maximum size of the thumbnail allowed to be shown
   */
  maxSize: number;

  constructor(
    @Inject('fieldProvider') public fieldProvider: LayoutField,
    @Inject('itemProvider') public itemProvider: Item,
    @Inject('renderingSubTypeProvider') public renderingSubTypeProvider: string,
    @Inject('tabNameProvider') public tabNameProvider: string,
    protected bitstreamDataService: BitstreamDataService,
    protected translateService: TranslateService,
  ) {
    super(fieldProvider, itemProvider, renderingSubTypeProvider, tabNameProvider, bitstreamDataService, translateService);
  }

  /**
   * Get the thumbnail information from api for this item
   */
  ngOnInit(): void {
    this.setDefaultImage();
    this.getBitstreamsByItem().pipe(
      map((bitstreamList: PaginatedList<Bitstream>) => bitstreamList.page),
      switchMap((filteredBitstreams: Bitstream[]) => {
        if (filteredBitstreams.length > 0) {
          if (isEmpty(filteredBitstreams[0].thumbnail)) {
            return observableOf(null);
          } else {
            return filteredBitstreams[0].thumbnail.pipe(
              getFirstCompletedRemoteData(),
              map((thumbnailRD) => {
                if (thumbnailRD.hasSucceeded && isNotEmpty(thumbnailRD.payload)) {
                  return thumbnailRD.payload;
                } else {
                  return null;
                }
              }),
            );
          }
        } else {
          return observableOf(null);
        }
      }),
    ).subscribe((thumbnail: Bitstream) => {
      if (isNotEmpty(thumbnail)) {
        this.thumbnail$.next(thumbnail);
      }
      this.initialized.next(true);
    });
  }

  /**
   * Set the default image src depending on item entity type
   */
  setDefaultImage(): void {
    const eType = this.item.firstMetadataValue('dspace.entity.type');
    this.default = 'assets/images/file-placeholder.svg';
    if (hasValue(eType) && eType.toUpperCase() === 'PROJECT') {
      this.default = 'assets/images/project-placeholder.svg';
    } else if (hasValue(eType) && eType.toUpperCase() === 'ORGUNIT') {
      this.default = 'assets/images/orgunit-placeholder.svg';
    } else if (hasValue(eType) && eType.toUpperCase() === 'PERSON') {
      this.default = 'assets/images/person-placeholder.svg';
    }
  }
}
