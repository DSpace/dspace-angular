import { Component } from '@angular/core';

import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { ViewMode } from '../../../../+search-page/search-options.model';
import { Item } from '../../../../core/shared/item.model';
import { ItemMyDSpaceResult } from '../../../object-collection/shared/item-my-dspace-result.model';
import { MyDSpaceResultGridElementComponent } from '../my-dspace-result-grid-element.component';

@Component({
  selector: 'ds-workspaceitem-my-dspace-result-grid-element',
  styleUrls: ['../my-dspace-result-grid-element.component.scss', './item-my-dspace-result-grid-element.component.scss'],
  templateUrl: './item-my-dspace-result-grid-element.component.html'
})

@renderElementsFor(ItemMyDSpaceResult, ViewMode.List)
export class ItemMyDSpaceResultGridElementComponent extends MyDSpaceResultGridElementComponent<ItemMyDSpaceResult, Item> {

  isInProgress(): boolean {
    return (!this.dso.isArchived) && (!this.dso.isWithdrawn);
  }
}
