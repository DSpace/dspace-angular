import { Injectable } from '@angular/core';
import { DSOBreadcrumbsService } from './dso-breadcrumbs.service';
import { DSOBreadcrumbResolver } from './dso-breadcrumb.resolver';
import { CommunityDataService } from '../data/community-data.service';
import { Community } from '../shared/community.model';

/**
 * The class that resolve the BreadcrumbConfig object for a route
 */
@Injectable()
export class CommunityBreadcrumbResolver extends DSOBreadcrumbResolver<Community> {
  constructor(protected breadcrumbService: DSOBreadcrumbsService, protected dataService: CommunityDataService) {
    super(breadcrumbService, dataService);
  }
}
