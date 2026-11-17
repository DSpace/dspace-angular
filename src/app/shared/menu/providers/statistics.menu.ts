/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthorizationDataService } from '@dspace/core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '@dspace/core/data/feature-authorization/feature-id';
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import {
  combineLatest,
  map,
  Observable,
  switchMap,
  take,
} from 'rxjs';

import { MenuItemType } from '../menu-item-type.model';
import { PartialMenuSection } from '../menu-provider.model';
import { DSpaceObjectPageMenuProvider } from './helper-providers/dso.menu';

/**
 * Menu provider to create the "Statistics" menu section in the public navbar. The menu depends on the page it is on.
 * When the user is on a DSO page or a derivative, this menu section will contain a link to the statistics of that DSO
 * In all other cases the menu section will contain a link to the repository wide statistics page.
 */
@Injectable()
export class StatisticsMenuProvider extends DSpaceObjectPageMenuProvider {
  private activatedRouteLastChild: any;

  constructor(
    protected authorizationService: AuthorizationDataService,
    protected route: ActivatedRoute,
  ) {
    super();
  }

  /**
   *  Get statistics route dso data
   */
  getObjectUrl(data) {
    const object = data.site ? data.site : data.dso?.payload;
    return object?._links?.self?.href;
  }

  /**
   *  Get activated route of the deepest activated route
   */
  getActivatedRoute(route) {
    if (route.children?.length > 0) {
      return this.getActivatedRoute(route.firstChild);
    } else {
      return route;
    }
  }

  /**
   *  Checking authorization for Usage
   */
  getAuthorizedUsageStatistics() {
    return this.activatedRouteLastChild.data.pipe(
      switchMap((data) => {
        return this.authorizationService.isAuthorized(FeatureID.CanViewUsageStatistics, this.getObjectUrl(data)).pipe(
          map((canViewUsageStatistics: boolean) => {
            return canViewUsageStatistics;
          }));
      }),
    );
  }

  /**
   *  Checking authorization for Login
   */
  getAuthorizedLoginStatistics() {
    return this.activatedRouteLastChild.data.pipe(
      switchMap((data) => {
        return this.authorizationService.isAuthorized(FeatureID.CanViewLoginStatistics, this.getObjectUrl(data)).pipe(
          map((canViewLoginStatistics: boolean) => {
            return canViewLoginStatistics;
          }));
      }),
    );
  }

  /**
   *  Checking authorization for Workflow
   */
  getAuthorizedWorkflowStatistics() {
    return this.activatedRouteLastChild.data.pipe(
      switchMap((data) => {
        return this.authorizationService.isAuthorized(FeatureID.CanViewWorkflowStatistics, this.getObjectUrl(data)).pipe(
          map((canViewWorkflowStatistics: boolean) => {
            return canViewWorkflowStatistics;
          }));
      }),
    );
  }

  public getSectionsForContext(dso: DSpaceObject): Observable<PartialMenuSection[]> {
    this.activatedRouteLastChild = this.getActivatedRoute(this.route);
    return combineLatest({
      canViewUsage: this.getAuthorizedUsageStatistics(),
      canViewLogin: this.getAuthorizedLoginStatistics(),
      canViewWorkflow: this.getAuthorizedWorkflowStatistics(),
    }).pipe(
      take(1),
      map(({ canViewUsage, canViewLogin, canViewWorkflow }) => {
        const menuList = [];
        if (canViewUsage || canViewLogin || canViewWorkflow) {
          if (canViewUsage) {
            menuList.push({
              id: 'statistics_site',
              parentID: 'statistics',
              active: false,
              visible: true,
              model: {
                type: MenuItemType.LINK,
                text: 'menu.section.statistics.site',
                link: '/statistics',
              },
            });
          }

          if (canViewLogin) {
            menuList.push({
              id: 'statistics_login',
              parentID: 'statistics',
              active: false,
              visible: true,
              model: {
                type: MenuItemType.LINK,
                text: 'menu.section.statistics.login',
                link: '/statistics/login',
              },
            });
          }

          if (canViewWorkflow) {
            menuList.push({
              id: 'statistics_workflow',
              parentID: 'statistics',
              active: false,
              visible: true,
              model: {
                type: MenuItemType.LINK,
                text: 'menu.section.statistics.workflow',
                link: '/statistics/workflow',
              },
            });
          }

          // the parent menu should be added after the children
          menuList.push(
            {
              id: 'statistics',
              active: false,
              visible: true,
              index: 1,
              model: {
                type: MenuItemType.TEXT,
                text: 'menu.section.statistics',
              },
            },
          );
        }
        return menuList;
      }));
  }

  protected isApplicable(dso: DSpaceObject): boolean {
    return true;
  }

}
