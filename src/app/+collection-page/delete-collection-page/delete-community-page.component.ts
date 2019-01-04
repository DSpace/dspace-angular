import { Component } from '@angular/core';
import { Community } from '../../core/shared/community.model';
import { CommunityDataService } from '../../core/data/community-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NormalizedCommunity } from '../../core/cache/models/normalized-community.model';
import { DeleteComColPageComponent } from '../../shared/comcol-forms/delete-comcol-page/delete-comcol-page.component';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { CollectionDataService } from '../../core/data/collection-data.service';
import { NormalizedCollection } from '../../core/cache/models/normalized-collection.model';
import { Collection } from '../../core/shared/collection.model';
import { TranslateService } from '@ngx-translate/core';

/**
 * Component that represents the page where a user can edit an existing Community
 */
@Component({
  selector: 'ds-delete-collection',
  styleUrls: ['./delete-collection-page.component.scss'],
  templateUrl: './delete-collection-page.component.html'
})
export class DeleteCollectionPageComponent extends DeleteComColPageComponent<Collection, NormalizedCollection> {
  protected frontendURL = '/collections/';

  public constructor(
    protected dsoDataService: CollectionDataService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected notifications: NotificationsService,
    protected translate: TranslateService
  ) {
    super(dsoDataService, router, route, notifications, translate);
  }
}
