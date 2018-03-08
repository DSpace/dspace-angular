import { Component } from '@angular/core';

import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { MyDSpaceResultListElementComponent, } from '../my-dspace-result-list-element.component';
import { ViewMode } from '../../../../+search-page/search-options.model';
import { Workspaceitem } from '../../../../core/submission/models/workspaceitem.model';
import { WorkspaceitemMyDSpaceResult } from '../../../object-collection/shared/workspaceitem-my-dspace-result.model';
import { Item } from '../../../../core/shared/item.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { Observable } from 'rxjs/Observable';
import { hasNoUndefinedValue, isNotEmpty, isNotUndefined } from '../../../empty.util';
import { ItemMyDSpaceResult } from '../../../object-collection/shared/item-my-dspace-result.model';

@Component({
  selector: 'ds-workspaceitem-my-dspace-result-list-element',
  styleUrls: ['../my-dspace-result-list-element.component.scss', './item-my-dspace-result-list-element.component.scss'],
  templateUrl: './item-my-dspace-result-list-element.component.html'
})

@renderElementsFor(ItemMyDSpaceResult, ViewMode.List)
export class ItemMyDSpaceResultListElementComponent extends MyDSpaceResultListElementComponent<ItemMyDSpaceResult, Item> {

  isInProgress(): boolean {
    return (!this.dso.isArchived) && (!this.dso.isWithdrawn);
  }
}
