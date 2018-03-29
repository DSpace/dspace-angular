import { Component } from '@angular/core';

import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { ViewMode } from '../../../../+search-page/search-options.model';
import { Item } from '../../../../core/shared/item.model';
import { ItemMyDSpaceResult } from '../../../object-collection/shared/item-my-dspace-result.model';
import { MyDSpaceResultDetailElementComponent } from '../my-dspace-result-detail-element.component';

@Component({
  selector: 'ds-workspaceitem-my-dspace-result-detail-element',
  styleUrls: ['../my-dspace-result-detail-element.component.scss', './item-my-dspace-result-detail-element.component.scss'],
  templateUrl: './item-my-dspace-result-detail-element.component.html'
})

@renderElementsFor(ItemMyDSpaceResult, ViewMode.Detail)
export class ItemMyDSpaceResultDetailElementComponent extends MyDSpaceResultDetailElementComponent<ItemMyDSpaceResult, Item> {

  isInProgress(): boolean {
    return (!this.dso.isArchived) && (!this.dso.isWithdrawn);
  }

  ngOnInit() {
    this.itemUrl = this.dso.findMetadata('dc.identifier.uri');
  }
}
