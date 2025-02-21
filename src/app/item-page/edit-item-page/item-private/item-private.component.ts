import { Component } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
} from '@angular/router';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

import { ItemDataService } from '@dspace/core';
import { RemoteData } from '@dspace/core';
import { NotificationsService } from '@dspace/core';
import { Item } from '@dspace/core';
import { getFirstCompletedRemoteData } from '@dspace/core';
import { ModifyItemOverviewComponent } from '../modify-item-overview/modify-item-overview.component';
import { AbstractSimpleItemActionComponent } from '../simple-item-action/abstract-simple-item-action.component';

@Component({
  selector: 'ds-item-private',
  templateUrl: '../simple-item-action/abstract-simple-item-action.component.html',
  standalone: true,
  imports: [
    ModifyItemOverviewComponent,
    TranslateModule,
    RouterLink,
  ],
})
/**
 * Component responsible for rendering the make item private page
 */
export class ItemPrivateComponent extends AbstractSimpleItemActionComponent {

  protected messageKey = 'private';
  protected predicate = (rd: RemoteData<Item>) => !rd.payload.isDiscoverable;

  constructor(protected route: ActivatedRoute,
              protected router: Router,
              protected notificationsService: NotificationsService,
              protected itemDataService: ItemDataService,
              protected translateService: TranslateService) {
    super(route, router, notificationsService, itemDataService, translateService);
  }

  /**
   * Perform the make private action to the item
   */
  performAction() {
    this.itemDataService.setDiscoverable(this.item, false).pipe(getFirstCompletedRemoteData()).subscribe(
      (rd: RemoteData<Item>) => {
        this.processRestResponse(rd);
      },
    );
  }
}
