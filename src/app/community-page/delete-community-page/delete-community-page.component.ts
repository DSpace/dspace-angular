import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import { Component } from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { CommunityDataService } from '../../core/data/community-data.service';
import { Community } from '../../core/shared/community.model';
import { DeleteComColPageComponent } from '../../shared/comcol/comcol-forms/delete-comcol-page/delete-comcol-page.component';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { VarDirective } from '../../shared/utils/var.directive';

/**
 * Component that represents the page where a user can delete an existing Community
 */
@Component({
  selector: 'ds-delete-community',
  styleUrls: ['./delete-community-page.component.scss'],
  templateUrl: './delete-community-page.component.html',
  imports: [
    TranslateModule,
    AsyncPipe,
    VarDirective,
    NgIf,
  ],
  standalone: true,
})
export class DeleteCommunityPageComponent extends DeleteComColPageComponent<Community> {
  protected frontendURL = '/communities/';

  public constructor(
    protected dsoDataService: CommunityDataService,
    public dsoNameService: DSONameService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected notifications: NotificationsService,
    protected translate: TranslateService,
  ) {
    super(dsoDataService, dsoNameService, router, route, notifications, translate);
  }

}
