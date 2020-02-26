import { Injectable } from '@angular/core';
import { DSOBreadcrumbsService } from './dso-breadcrumbs.service';
import { DSOBreadcrumbResolver } from './dso-breadcrumb.resolver';
import { Collection } from '../shared/collection.model';
import { CollectionDataService } from '../data/collection-data.service';

/**
 * The class that resolve the BreadcrumbConfig object for a route
 */
@Injectable()
export class CollectionBreadcrumbResolver extends DSOBreadcrumbResolver<Collection> {
  constructor(protected breadcrumbService: DSOBreadcrumbsService, protected dataService: CollectionDataService) {
    super(breadcrumbService, dataService);
  }
}
