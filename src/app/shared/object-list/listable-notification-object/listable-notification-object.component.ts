import { Component } from '@angular/core';
import { ListableNotificationObject } from '@dspace/core/shared/listable-notification-object.model';
import { LISTABLE_NOTIFICATION_OBJECT } from '@dspace/core/shared/object-collection/listable-notification-object.resource-type';
import { ViewMode } from '@dspace/core/shared/view-mode.model';
import { TranslateModule } from '@ngx-translate/core';

import { listableObjectComponent } from '../../object-collection/shared/listable-object/listable-object.decorator';
import { AbstractListableElementComponent } from '../../object-collection/shared/object-collection-element/abstract-listable-element.component';

/**
 * The component for displaying a notifications inside an object list
 */
@listableObjectComponent(ListableNotificationObject, ViewMode.ListElement)
@listableObjectComponent(LISTABLE_NOTIFICATION_OBJECT.value, ViewMode.ListElement)
@Component({
  selector: 'ds-listable-notification-object',
  templateUrl: './listable-notification-object.component.html',
  styleUrls: ['./listable-notification-object.component.scss'],
  standalone: true,
  imports: [
    TranslateModule,
  ],
})
export class ListableNotificationObjectComponent extends AbstractListableElementComponent<ListableNotificationObject> {
}
