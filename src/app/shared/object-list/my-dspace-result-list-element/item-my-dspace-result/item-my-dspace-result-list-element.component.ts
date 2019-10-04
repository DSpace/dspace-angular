import { Component } from '@angular/core';

import { MyDSpaceResultListElementComponent, } from '../my-dspace-result-list-element.component';
import { Item } from '../../../../core/shared/item.model';
import { ItemMyDSpaceResult } from '../../../object-collection/shared/item-my-dspace-result.model';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { Context } from '../../../../core/shared/context.model';

/**
 * This component renders item object for the mydspace result in the list view.
 */
@Component({
  selector: 'ds-workspaceitem-my-dspace-result-list-element',
  styleUrls: ['../my-dspace-result-list-element.component.scss', './item-my-dspace-result-list-element.component.scss'],
  templateUrl: './item-my-dspace-result-list-element.component.html'
})

@listableObjectComponent('PublicationSearchResult', ViewMode.ListElement, Context.Submission)
export class ItemMyDSpaceResultListElementComponent extends MyDSpaceResultListElementComponent<ItemMyDSpaceResult, Item> {

  /**
   * Represent item's status
   */
  public status = MyDspaceItemStatusType.ARCHIVED;

}
