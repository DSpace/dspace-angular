import { Injectable } from '@angular/core';
import { DSOBreadcrumbsService } from './dso-breadcrumbs.service';
import { DSOBreadcrumbResolver } from './dso-breadcrumb.resolver';
import { CommunityDataService } from '../data/community-data.service';
import { Community } from '../shared/community.model';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { COMMUNITY_PAGE_LINKS_TO_FOLLOW } from '../../community-page/community-page.resolver';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { BreadcrumbConfig } from '../../breadcrumbs/breadcrumb/breadcrumb-config.model';
import { hasValue } from '../../shared/empty.util';

/**
 * The class that resolves the BreadcrumbConfig object for a Community
 */
@Injectable({
  providedIn: 'root'
})
export class CommunityBreadcrumbResolver extends DSOBreadcrumbResolver<Community> {
  constructor(protected breadcrumbService: DSOBreadcrumbsService, protected dataService: CommunityDataService) {
    super(breadcrumbService, dataService);
  }

  /**
   * Method to retrieve the breadcrumb config by the route id. It is also possible to retrieve the id through the
   * query parameters. This is done by defining the name of the query parameter in the data section under the property
   * breadcrumbQueryParam.
   *
   * @param route The current {@link ActivatedRouteSnapshot}
   * @param state The current {@link RouterStateSnapshot}
   * @returns BreadcrumbConfig object
   */
  override resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BreadcrumbConfig<Community>> {
    if (hasValue(route.data.breadcrumbQueryParam) && hasValue(route.queryParams[route.data.breadcrumbQueryParam])) {
      return this.resolveById(route.queryParams[route.data.breadcrumbQueryParam]);
    } else {
      return super.resolve(route, state);
    }
  }

  /**
   * Method that returns the follow links to already resolve
   * The self links defined in this list are expected to be requested somewhere in the near future
   * Requesting them as embeds will limit the number of requests
   */
  get followLinks(): FollowLinkConfig<Community>[] {
    return COMMUNITY_PAGE_LINKS_TO_FOLLOW;
  }
}
