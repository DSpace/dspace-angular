import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { CommunityDataService } from '@dspace/core/data/community-data.service';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { Community } from '@dspace/core/shared/community.model';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

import { BtnDisabledDirective } from '../../shared/btn-disabled.directive';
import { DeleteComColPageComponent } from '../../shared/comcol/comcol-forms/delete-comcol-page/delete-comcol-page.component';
import { VarDirective } from '../../shared/utils/var.directive';

/**
 * Component that represents the page where a user can delete an existing Community
 */
@Component({
  selector: 'ds-delete-community',
  styleUrls: ['./delete-community-page.component.scss'],
  templateUrl: './delete-community-page.component.html',
  imports: [
    AsyncPipe,
    BtnDisabledDirective,
    TranslateModule,
    VarDirective,
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
