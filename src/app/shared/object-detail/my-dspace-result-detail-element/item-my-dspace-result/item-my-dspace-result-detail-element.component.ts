import { Component } from '@angular/core';

import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { Item } from '../../../../core/shared/item.model';
import { ItemMyDSpaceResult } from '../../../object-collection/shared/item-my-dspace-result.model';
import { MyDSpaceResultDetailElementComponent } from '../my-dspace-result-detail-element.component';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { SetViewMode } from '../../../view-mode';

/**
 * This component renders item object for the mydspace result in the detail view.
 */
@Component({
  selector: 'ds-workspaceitem-my-dspace-result-detail-element',
  styleUrls: ['../my-dspace-result-detail-element.component.scss', './item-my-dspace-result-detail-element.component.scss'],
  templateUrl: './item-my-dspace-result-detail-element.component.html'
})

@renderElementsFor(ItemMyDSpaceResult, SetViewMode.Detail)
export class ItemMyDSpaceResultDetailElementComponent extends MyDSpaceResultDetailElementComponent<ItemMyDSpaceResult, Item> {

  /**
   * Represent item's status
   */
  public status = MyDspaceItemStatusType.ARCHIVED;

}
