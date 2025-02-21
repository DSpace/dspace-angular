import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

import { DSONameService } from '../../../../modules/core/src/lib/core/breadcrumbs/dso-name.service';
import { CommunityDataService } from '../../../../modules/core/src/lib/core/data/community-data.service';
import { NotificationsService } from '../../../../modules/core/src/lib/core/notifications/notifications.service';
import { Community } from '../../../../modules/core/src/lib/core/shared/community.model';
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
    TranslateModule,
    AsyncPipe,
    VarDirective,
    BtnDisabledDirective,
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
