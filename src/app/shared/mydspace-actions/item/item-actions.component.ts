import { Component, Injector, Input } from '@angular/core';
import { Router } from '@angular/router';

import { MyDSpaceActionsComponent } from '../mydspace-actions';
import { ResourceType } from '../../../core/shared/resource-type';
import { ItemDataService } from '../../../core/data/item-data.service';
import { Item } from '../../../core/shared/item.model';

@Component({
  selector: 'ds-item-actions',
  styleUrls: ['./item-actions.component.scss'],
  templateUrl: './item-actions.component.html',
})

export class ItemActionsComponent extends MyDSpaceActionsComponent<Item, ItemDataService> {
  @Input() object: Item;

  constructor(protected injector: Injector,
              protected router: Router) {
    super(ResourceType.Workspaceitem, injector, router);
  }

  initObjects(object: Item) {
    this.object = object;
  }

}
