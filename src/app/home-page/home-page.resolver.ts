import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { SiteDataService } from '@dspace/core';
import { Site } from '@dspace/core';

export const homePageResolver: ResolveFn<Site> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  siteService: SiteDataService = inject(SiteDataService),
): Observable<Site> => {
  return siteService.find().pipe(take(1));
};
