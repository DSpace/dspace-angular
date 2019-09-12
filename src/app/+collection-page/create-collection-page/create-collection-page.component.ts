import { Component } from '@angular/core';
import { CommunityDataService } from '../../core/data/community-data.service';
import { RouteService } from '../../core/services/route.service';
import { Router } from '@angular/router';
import { CreateComColPageComponent } from '../../shared/comcol-forms/create-comcol-page/create-comcol-page.component';
import { Collection } from '../../core/shared/collection.model';
import { CollectionDataService } from '../../core/data/collection-data.service';

/**
 * Component that represents the page where a user can create a new Collection
 */
@Component({
  selector: 'ds-create-collection',
  styleUrls: ['./create-collection-page.component.scss'],
  templateUrl: './create-collection-page.component.html'
})
export class CreateCollectionPageComponent extends CreateComColPageComponent<Collection> {
  protected frontendURL = '/collections/';

  public constructor(
    protected communityDataService: CommunityDataService,
    protected collectionDataService: CollectionDataService,
    protected routeService: RouteService,
    protected router: Router
  ) {
    super(collectionDataService, communityDataService, routeService, router);
  }
}
