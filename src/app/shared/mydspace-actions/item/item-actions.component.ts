import { Component, Injector, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { MyDSpaceActionsComponent } from '../mydspace-actions';
import { ResourceType } from '../../../core/shared/resource-type';
import { ItemDataService } from '../../../core/data/item-data.service';
import { NormalizedItem } from '../../../core/cache/models/normalized-item.model';
import { Item } from '../../../core/shared/item.model';
import { RoleService } from '../../../core/roles/role.service';

@Component({
  selector: 'ds-item-actions',
  styleUrls: ['./item-actions.component.scss'],
  templateUrl: './item-actions.component.html',
})

export class ItemActionsComponent extends MyDSpaceActionsComponent<Item, NormalizedItem, ItemDataService> implements OnInit {
  @Input() object: Item;

  public isAdmin: Observable<boolean>;
  public itemUrl: string;

  constructor(protected injector: Injector,
              protected roleService: RoleService,
              protected router: Router) {
    super(ResourceType.Workspaceitem, injector, router);
  }

  ngOnInit() {
    this.isAdmin = this.roleService.isAdmin();
    this.itemUrl = this.object.firstMetadataValue('dc.identifier.uri');
  }

  initObjects(object: Item) {
    this.object = object;
  }

}
