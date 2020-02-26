import { Injectable } from '@angular/core';
import { DSOBreadcrumbsService } from './dso-breadcrumbs.service';
import { ItemDataService } from '../data/item-data.service';
import { Item } from '../shared/item.model';
import { DSOBreadcrumbResolver } from './dso-breadcrumb.resolver';

/**
 * The class that resolves the BreadcrumbConfig object for an Item
 */
@Injectable()
export class ItemBreadcrumbResolver extends DSOBreadcrumbResolver<Item> {
  constructor(protected breadcrumbService: DSOBreadcrumbsService, protected dataService: ItemDataService) {
    super(breadcrumbService, dataService);
  }
}
