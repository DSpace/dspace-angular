import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { CollectionDataService } from '../../core/data/collection-data.service';
import { CommunityDataService } from '../../core/data/community-data.service';
import { RequestService } from '../../core/data/request.service';
import { RouteService } from '../../core/services/route.service';
import { Collection } from '../../core/shared/collection.model';
import { CreateComColPageComponent } from '../../shared/comcol/comcol-forms/create-comcol-page/create-comcol-page.component';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { CollectionFormComponent } from '../collection-form/collection-form.component';

/**
 * Component that represents the page where a user can create a new Collection
 */
@Component({
  selector: 'ds-create-collection',
  styleUrls: ['./create-collection-page.component.scss'],
  templateUrl: './create-collection-page.component.html',
  imports: [
    CollectionFormComponent,
    TranslateModule,
    AsyncPipe,
    ThemedLoadingComponent,
    NgIf,
  ],
  standalone: true,
})
export class CreateCollectionPageComponent extends CreateComColPageComponent<Collection> {
  protected frontendURL = '/collections/';
  protected type = Collection.type;

  public constructor(
    public dsoNameService: DSONameService,
    protected communityDataService: CommunityDataService,
    protected collectionDataService: CollectionDataService,
    protected routeService: RouteService,
    protected router: Router,
    protected notificationsService: NotificationsService,
    protected translate: TranslateService,
    protected requestService: RequestService,
  ) {
    super(collectionDataService, dsoNameService, communityDataService, routeService, router, notificationsService, translate, requestService);
  }
}
