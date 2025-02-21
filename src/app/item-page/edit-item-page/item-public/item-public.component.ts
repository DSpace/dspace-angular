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

import { ItemDataService } from '../../../../../modules/core/src/lib/core/data/item-data.service';
import { RemoteData } from '../../../../../modules/core/src/lib/core/data/remote-data';
import { NotificationsService } from '../../../../../modules/core/src/lib/core/notifications/notifications.service';
import { Item } from '../../../../../modules/core/src/lib/core/shared/item.model';
import { getFirstCompletedRemoteData } from '../../../../../modules/core/src/lib/core/shared/operators';
import { ModifyItemOverviewComponent } from '../modify-item-overview/modify-item-overview.component';
import { AbstractSimpleItemActionComponent } from '../simple-item-action/abstract-simple-item-action.component';

@Component({
  selector: 'ds-item-public',
  templateUrl: '../simple-item-action/abstract-simple-item-action.component.html',
  standalone: true,
  imports: [
    ModifyItemOverviewComponent,
    TranslateModule,
    RouterLink,
  ],
})
/**
 * Component responsible for rendering the make item public page
 */
export class ItemPublicComponent extends AbstractSimpleItemActionComponent {

  protected messageKey = 'public';
  protected predicate = (rd: RemoteData<Item>) => rd.payload.isDiscoverable;

  constructor(protected route: ActivatedRoute,
              protected router: Router,
              protected notificationsService: NotificationsService,
              protected itemDataService: ItemDataService,
              protected translateService: TranslateService) {
    super(route, router, notificationsService, itemDataService, translateService);
  }

  /**
   * Perform the make public action to the item
   */
  performAction() {
    this.itemDataService.setDiscoverable(this.item, true).pipe(getFirstCompletedRemoteData()).subscribe(
      (response: RemoteData<Item>) => {
        this.processRestResponse(response);
      },
    );
  }
}
