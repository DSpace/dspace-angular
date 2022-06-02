import { Component, OnInit } from '@angular/core';
import { listableObjectComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { focusShadow } from '../../../../../shared/animations/focus';
import { ItemSearchResultGridElementComponent } from '../../../../../shared/object-grid/search-result-grid-element/item-search-result/item/item-search-result-grid-element.component';
import { isEmpty, isNotEmpty, isNull } from '../../../../../shared/empty.util';
import { map, switchMap } from 'rxjs/operators';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { BitstreamDataService } from '../../../../../core/data/bitstream-data.service';
import { ThumbnailService } from '../../../../../shared/thumbnail/thumbnail.service';
import { RemoteData } from '../../../../../core/data/remote-data';
import { ConfigurationProperty } from '../../../../../core/shared/configuration-property.model';
import { Bitstream } from 'src/app/core/shared/bitstream.model';
import { getFirstCompletedRemoteData, getRemoteDataPayload } from '../../../../../core/shared/operators';

@listableObjectComponent('PersonSearchResult', ViewMode.GridElement)
@Component({
  selector: 'ds-person-search-result-grid-element',
  styleUrls: ['./person-search-result-grid-element.component.scss'],
  templateUrl: './person-search-result-grid-element.component.html',
  animations: [focusShadow]
})
/**
 * The component for displaying a grid element for an item search result of the type Person
 */
export class PersonSearchResultGridElementComponent extends ItemSearchResultGridElementComponent {

  constructor(
    protected truncatableService: TruncatableService,
    protected bitstreamDataService: BitstreamDataService,
    protected thumbnailService: ThumbnailService,
  ) {
    super(truncatableService, bitstreamDataService);
  }

  getThumbnail() {
    return this.dso.thumbnail.pipe(
      getFirstCompletedRemoteData(),
      getRemoteDataPayload(),
      switchMap((thumbnail: Bitstream) => this.thumbnailService.getConfig().pipe(
        map((remoteData: RemoteData<ConfigurationProperty>) => {
          // make sure we got a success response from the backend
          if (!remoteData.hasSucceeded || isNull(thumbnail)) { return; }
          console.log(thumbnail);
          const maxSize = parseInt(remoteData.payload.values[0], 10);
          if (!isEmpty(maxSize) && !isEmpty(thumbnail)) {
            // max size is in KB so we need to multiply with 1000
            if (thumbnail.sizeBytes <= maxSize * 1000) {
              return thumbnail;
            } else {
              return null;
            }
          }
          return thumbnail;
        }))
      )
    );
  }

  getPersonName(): string {
    let personName = this.dso.name;
    if (isNotEmpty(this.firstMetadataValue('person.familyName')) && isNotEmpty(this.firstMetadataValue('person.givenName'))) {
      personName = this.firstMetadataValue('person.familyName') + ', ' + this.firstMetadataValue('person.givenName');
    }

    return personName;
  }
}
