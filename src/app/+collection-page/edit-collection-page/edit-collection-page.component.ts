import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditComColPageComponent } from '../../shared/comcol-forms/edit-comcol-page/edit-comcol-page.component';
import { Collection } from '../../core/shared/collection.model';
import { CollectionDataService } from '../../core/data/collection-data.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';

/**
 * Component that represents the page where a user can edit an existing Collection
 */
@Component({
  selector: 'ds-edit-collection',
  styleUrls: ['./edit-collection-page.component.scss'],
  templateUrl: './edit-collection-page.component.html'
})
export class EditCollectionPageComponent extends EditComColPageComponent<Collection> {
  protected frontendURL = '/collections/';
  protected type = Collection.type;

  public constructor(
    protected collectionDataService: CollectionDataService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected notificationsService: NotificationsService,
    protected translate: TranslateService
  ) {
    super(collectionDataService, router, route, notificationsService, translate);
  }
}
