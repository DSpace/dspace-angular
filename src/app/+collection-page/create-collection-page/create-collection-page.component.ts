import { Component } from '@angular/core';
import { Community } from '../../core/shared/community.model';
import { ComColDataService } from '../../core/data/comcol-data.service';
import { NormalizedCommunity } from '../../core/cache/models/normalized-community.model';
import { CommunityDataService } from '../../core/data/community-data.service';
import { CollectionDataService } from '../../core/data/collection-data.service';
import { Collection } from '../../core/shared/collection.model';

@Component({
  selector: 'ds-create-collection',
  styleUrls: ['./create-collection-page.component.scss'],
  templateUrl: './create-collection-page.component.html'
})
export class CreateCollectionPageComponent {

  public constructor(private collectionDataService: CollectionDataService) {

  }

  onSubmit(data: any) {
    const collection = Object.assign(new Collection(), {
      name: data.name
    });
    this.collectionDataService.create(collection);
  }

}
