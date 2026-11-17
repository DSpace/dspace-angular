import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { CollectionDataService } from '@dspace/core/data/collection-data.service';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { Collection } from '@dspace/core/shared/collection.model';
import { TranslateService } from '@ngx-translate/core';

import { ComcolMetadataComponent } from '../../../shared/comcol/comcol-forms/edit-comcol-page/comcol-metadata/comcol-metadata.component';
import { CollectionFormComponent } from '../../collection-form/collection-form.component';

/**
 * Component for editing a collection's metadata
 */
@Component({
  selector: 'ds-collection-metadata',
  templateUrl: './collection-metadata.component.html',
  imports: [
    AsyncPipe,
    CollectionFormComponent,
  ],
})
export class CollectionMetadataComponent extends ComcolMetadataComponent<Collection> {
  protected frontendURL = '/collections/';
  protected type = Collection.type;

  public constructor(
    protected collectionDataService: CollectionDataService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected notificationsService: NotificationsService,
    protected translate: TranslateService,
  ) {
    super(collectionDataService, router, route, notificationsService, translate);
  }
}
