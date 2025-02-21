import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  APP_CONFIG,
  AppConfig,
} from '@dspace/core';
import { PaginatedList } from '@dspace/core';
import { QualityAssuranceSourceObject } from '@dspace/core';
import { QualityAssuranceSourceService } from '../../notifications/qa/source/quality-assurance-source.service';

/**
 * Method for resolving the parameters in the current route.
 * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
 * @param {RouterStateSnapshot} state The current RouterStateSnapshot
 * @param router
 * @param qualityAssuranceSourceService
 * @param appConfig
 * @returns Observable<QualityAssuranceSourceObject[]>
 */
export const qualityAssuranceSourceDataResolver: ResolveFn<QualityAssuranceSourceObject[]> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  router: Router = inject(Router),
  qualityAssuranceSourceService: QualityAssuranceSourceService = inject(QualityAssuranceSourceService),
  appConfig: AppConfig = inject(APP_CONFIG),
): Observable<QualityAssuranceSourceObject[]> => {
  const pageSize = appConfig.qualityAssuranceConfig.pageSize;

  return qualityAssuranceSourceService.getSources(pageSize, 0).pipe(
    map((sources: PaginatedList<QualityAssuranceSourceObject>) => {
      if (sources.page.length === 1) {
        router.navigate([getResolvedUrl(route) + '/' + sources.page[0].id]);
      }
      return sources.page;
    }));
};

/**
 *
 * @param route url path
 * @returns url path
 */
function getResolvedUrl(route: ActivatedRouteSnapshot): string {
  return route.pathFromRoot.map(v => v.url.map(segment => segment.toString()).join('/')).join('/');
}
