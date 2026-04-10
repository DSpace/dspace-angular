import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';

import { ViewTrackerResolverService } from './view-tracker-resolver.service';

export const viewTrackerResolver: ResolveFn<boolean> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  viewTrackerResolverService: ViewTrackerResolverService = inject(ViewTrackerResolverService),
): boolean => {
  return viewTrackerResolverService.resolve(route, state);
};
