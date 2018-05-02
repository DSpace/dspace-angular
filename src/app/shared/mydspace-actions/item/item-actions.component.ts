import { Component, Injector, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MyDSpaceActionsComponent } from '../mydspace-actions';
import { ResourceType } from '../../../core/shared/resource-type';
import { Observable } from 'rxjs/Observable';
import { ItemDataService } from '../../../core/data/item-data.service';
import { NormalizedItem } from '../../../core/cache/models/normalized-item.model';
import { Item } from '../../../core/shared/item.model';
import { RolesService } from '../../../core/roles/roles.service';

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
              protected rolesService: RolesService,
              protected router: Router) {
    super(ResourceType.Workspaceitem, injector, router);
  }

  ngOnInit() {
    this.isAdmin = this.rolesService.isAdmin();
    this.itemUrl = this.object.findMetadata('dc.identifier.uri');
  }

  initObjects(object: Item) {
    this.object = object;
  }

}
