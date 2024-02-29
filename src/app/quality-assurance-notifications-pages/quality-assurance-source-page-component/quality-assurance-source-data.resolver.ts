import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { QualityAssuranceSourceObject } from '../../core/notifications/qa/models/quality-assurance-source.model';
import { QualityAssuranceSourceService } from '../../notifications/qa/source/quality-assurance-source.service';
import {environment} from '../../../environments/environment';
/**
 * This class represents a resolver that retrieve the route data before the route is activated.
 */
@Injectable()
export class SourceDataResolver implements Resolve<Observable<QualityAssuranceSourceObject[]>> {
  private  pageSize = environment.qualityAssuranceConfig.pageSize;
  /**
   * Initialize the effect class variables.
   * @param {QualityAssuranceSourceService} qualityAssuranceSourceService
   */
   constructor(
    private qualityAssuranceSourceService: QualityAssuranceSourceService,
    private router: Router
  ) { }
  /**
   * Method for resolving the parameters in the current route.
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns Observable<QualityAssuranceSourceObject[]>
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<QualityAssuranceSourceObject[]> {
    return this.qualityAssuranceSourceService.getSources(this.pageSize, 0).pipe(
        map((sources: PaginatedList<QualityAssuranceSourceObject>) => {
          if (sources.page.length === 1) {
             this.router.navigate([this.getResolvedUrl(route) + '/' + sources.page[0].id]);
          }
         return sources.page;
        }));
  }

  /**
   *
   * @param route url path
   * @returns url path
   */
  getResolvedUrl(route: ActivatedRouteSnapshot): string {
    return route.pathFromRoot.map(v => v.url.map(segment => segment.toString()).join('/')).join('/');
  }
}
