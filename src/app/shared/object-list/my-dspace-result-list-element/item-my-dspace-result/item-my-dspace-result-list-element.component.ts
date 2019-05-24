import { Component } from '@angular/core';

import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { MyDSpaceResultListElementComponent, } from '../my-dspace-result-list-element.component';
import { Item } from '../../../../core/shared/item.model';
import { ItemMyDSpaceResult } from '../../../object-collection/shared/item-my-dspace-result.model';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { SetViewMode } from '../../../view-mode';

/**
 * This component renders item object for the mydspace result in the list view.
 */
@Component({
  selector: 'ds-workspaceitem-my-dspace-result-list-element',
  styleUrls: ['../my-dspace-result-list-element.component.scss', './item-my-dspace-result-list-element.component.scss'],
  templateUrl: './item-my-dspace-result-list-element.component.html'
})

@renderElementsFor(ItemMyDSpaceResult, SetViewMode.List)
export class ItemMyDSpaceResultListElementComponent extends MyDSpaceResultListElementComponent<ItemMyDSpaceResult, Item> {

  /**
   * Represent item's status
   */
  public status = MyDspaceItemStatusType.ARCHIVED;

}
