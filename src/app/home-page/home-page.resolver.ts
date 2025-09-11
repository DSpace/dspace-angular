import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { SiteDataService, Site } from '@dspace/core'
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

export const homePageResolver: ResolveFn<Site> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  siteService: SiteDataService = inject(SiteDataService),
): Observable<Site> => {
  return siteService.find().pipe(take(1));
};
