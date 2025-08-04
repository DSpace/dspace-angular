import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { CollectionDataService } from '@dspace/core/data/collection-data.service';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { Collection } from '@dspace/core/shared/collection.model';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

import { BtnDisabledDirective } from '../../shared/btn-disabled.directive';
import { DeleteComColPageComponent } from '../../shared/comcol/comcol-forms/delete-comcol-page/delete-comcol-page.component';
import { VarDirective } from '../../shared/utils/var.directive';

/**
 * Component that represents the page where a user can delete an existing Collection
 */
@Component({
  selector: 'ds-delete-collection',
  styleUrls: ['./delete-collection-page.component.scss'],
  templateUrl: './delete-collection-page.component.html',
  imports: [
    AsyncPipe,
    BtnDisabledDirective,
    TranslateModule,
    VarDirective,
  ],
  standalone: true,
})
export class DeleteCollectionPageComponent extends DeleteComColPageComponent<Collection> {
  protected frontendURL = '/collections/';

  public constructor(
    protected dsoDataService: CollectionDataService,
    public dsoNameService: DSONameService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected notifications: NotificationsService,
    protected translate: TranslateService,
  ) {
    super(dsoDataService, dsoNameService, router, route, notifications, translate);
  }
}
