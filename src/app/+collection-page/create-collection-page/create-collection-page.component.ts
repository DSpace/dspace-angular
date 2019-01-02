import { Component } from '@angular/core';
import { CommunityDataService } from '../../core/data/community-data.service';
import { RouteService } from '../../shared/services/route.service';
import { Router } from '@angular/router';
import { CreateComColPageComponent } from '../../comcol-forms/create-comcol-page/create-comcol-page.component';
import { NormalizedCollection } from '../../core/cache/models/normalized-collection.model';
import { Collection } from '../../core/shared/collection.model';
import { CollectionDataService } from '../../core/data/collection-data.service';

@Component({
  selector: 'ds-create-community',
  styleUrls: ['./create-community-page.component.scss'],
  templateUrl: './create-community-page.component.html'
})
export class CreateCommunityPageComponent extends CreateComColPageComponent<Collection, NormalizedCollection> {
  protected frontendURL = 'collections';

  public constructor(
    protected communityDataService: CommunityDataService,
    protected collectionDataService: CollectionDataService,
    protected routeService: RouteService,
    protected router: Router
  ) {
    super(collectionDataService, communityDataService, routeService, router);
  }
}
