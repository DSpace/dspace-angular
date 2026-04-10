import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveEnd,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Angulartics2 } from 'angulartics2';
import { switchMap } from 'rxjs';
import {
  filter,
  take,
} from 'rxjs/operators';

import { ReferrerService } from '../../../core/services/referrer.service';

/**
 * This component triggers a page view statistic
 */
@Injectable({
  providedIn: 'root',
})
export class ViewTrackerResolverService {

  constructor(
    public angulartics2: Angulartics2,
    public referrerService: ReferrerService,
    public router: Router,
  ) {
  }

  resolve(routeSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const dsoPath = routeSnapshot.data.dsoPath || 'dso.payload'; // Fetch the resolvers passed via the route data
    this.router.events.pipe(
      filter(event => event instanceof ResolveEnd),
      take(1),
      switchMap(() =>
        this.referrerService.getReferrer().pipe(take(1))))
      .subscribe((referrer: string) => {
        this.angulartics2.eventTrack.next({
          action: 'page_view',
          properties: {
            object: this.getNestedProperty(routeSnapshot.data, dsoPath),
            referrer,
          },
        });
      });
    return true;
  }

  private getNestedProperty(obj: any, path: string) {
    const keys = path.split('.');
    let result = obj;

    for (const key of keys) {
      if (result && result.hasOwnProperty(key)) {
        result = result[key];
      } else {
        return undefined;
      }
    }
    return result;
  }
}
