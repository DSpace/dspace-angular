import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { CommunityDataService } from '@dspace/core/data/community-data.service';
import { RequestService } from '@dspace/core/data/request.service';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { RouteService } from '@dspace/core/services/route.service';
import { Community } from '@dspace/core/shared/community.model';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

import { CreateComColPageComponent } from '../../shared/comcol/comcol-forms/create-comcol-page/create-comcol-page.component';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { VarDirective } from '../../shared/utils/var.directive';
import { CommunityFormComponent } from '../community-form/community-form.component';

/**
 * Component that represents the page where a user can create a new Community
 */
@Component({
  selector: 'ds-create-community',
  styleUrls: ['./create-community-page.component.scss'],
  templateUrl: './create-community-page.component.html',
  imports: [
    AsyncPipe,
    CommunityFormComponent,
    ThemedLoadingComponent,
    TranslateModule,
    VarDirective,
  ],
  standalone: true,
})
export class CreateCommunityPageComponent extends CreateComColPageComponent<Community> {
  protected frontendURL = '/communities/';
  protected type = Community.type;

  public constructor(
    protected communityDataService: CommunityDataService,
    public dsoNameService: DSONameService,
    protected routeService: RouteService,
    protected router: Router,
    protected notificationsService: NotificationsService,
    protected translate: TranslateService,
    protected requestService: RequestService,
  ) {
    super(communityDataService, dsoNameService, communityDataService, routeService, router, notificationsService, translate, requestService);
  }
}
