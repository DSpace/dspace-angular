import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { NotificationsBrokerSourceObject } from '../../../core/notifications/broker/models/notifications-broker-source.model';
import { NotificationsBrokerSourceService } from '../../../notifications/broker/source/notifications-broker-source.service';
/**
 * This class represents a resolver that retrieve the route data before the route is activated.
 */
@Injectable()
export class SourceDataResolver implements Resolve<Observable<NotificationsBrokerSourceObject[]>> {
  /**
   * Initialize the effect class variables.
   * @param {NotificationsBrokerSourceService} notificationsBrokerSourceService
   */
   constructor(
    private notificationsBrokerSourceService: NotificationsBrokerSourceService,
    private router: Router
  ) { }
  /**
   * Method for resolving the parameters in the current route.
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns Observable<NotificationsBrokerSourceObject[]>
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<NotificationsBrokerSourceObject[]> {
    return this.notificationsBrokerSourceService.getSources(5,0).pipe(
        map((sources: PaginatedList<NotificationsBrokerSourceObject>) => {
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
