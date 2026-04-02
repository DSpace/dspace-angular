import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { itemBreadcrumbResolver } from '@dspace/core/breadcrumbs/item-breadcrumb.resolver';
import { Observable } from 'rxjs';

import { Item } from '../shared/item.model';
import { BreadcrumbConfig } from './models/breadcrumb-config.model';

/**
 * The resolve function that resolves the BreadcrumbConfig object for an Item in edit mode
 */
export const editItemBreadcrumbResolver: ResolveFn<BreadcrumbConfig<Item>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Observable<BreadcrumbConfig<Item>> => {
  const routeWithCorrectId = Object.assign(route, {
    params: {
      ...route.params,
      id: route.params.id.split(':')[0],
    },
  });

  return itemBreadcrumbResolver(routeWithCorrectId, state) as Observable<BreadcrumbConfig<Item>>;
};
