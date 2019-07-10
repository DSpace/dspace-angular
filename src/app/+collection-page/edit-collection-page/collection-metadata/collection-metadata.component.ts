import { Component } from '@angular/core';
import { ComcolMetadataComponent } from '../../../shared/comcol-forms/edit-comcol-page/comcol-metadata/comcol-metadata.component';
import { Collection } from '../../../core/shared/collection.model';
import { CollectionDataService } from '../../../core/data/collection-data.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ds-collection-metadata',
  templateUrl: './collection-metadata.component.html',
})
export class CollectionMetadataComponent extends ComcolMetadataComponent<Collection> {
  protected frontendURL = '/collections/';

  public constructor(
    protected collectionDataService: CollectionDataService,
    protected router: Router,
    protected route: ActivatedRoute
  ) {
    super(collectionDataService, router, route);
  }
}
