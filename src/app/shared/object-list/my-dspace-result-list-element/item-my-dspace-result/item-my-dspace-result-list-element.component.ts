import { Component, OnInit } from '@angular/core';

import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { MyDSpaceResultListElementComponent, } from '../my-dspace-result-list-element.component';
import { ViewMode } from '../../../../+search-page/search-options.model';
import { Item } from '../../../../core/shared/item.model';
import { ItemMyDSpaceResult } from '../../../object-collection/shared/item-my-dspace-result.model';
import { ItemStatusType } from '../../../object-collection/shared/mydspace-item-status/item-status-type';

@Component({
  selector: 'ds-workspaceitem-my-dspace-result-list-element',
  styleUrls: ['../my-dspace-result-list-element.component.scss', './item-my-dspace-result-list-element.component.scss'],
  templateUrl: './item-my-dspace-result-list-element.component.html'
})

@renderElementsFor(ItemMyDSpaceResult, ViewMode.List)
export class ItemMyDSpaceResultListElementComponent extends MyDSpaceResultListElementComponent<ItemMyDSpaceResult, Item> implements OnInit {

  public itemUrl: string;
  public status = ItemStatusType.ACCEPTED;

  ngOnInit() {
    this.itemUrl = this.dso.findMetadata('dc.identifier.uri');
  }

}
