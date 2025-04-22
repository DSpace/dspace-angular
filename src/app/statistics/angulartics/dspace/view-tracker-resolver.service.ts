import {
  AfterViewChecked, AfterViewInit,
  Component, Injectable,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Angulartics2 } from 'angulartics2';
import { Observable, Subscription, switchMap } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { ReferrerService } from '../../../core/services/referrer.service';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { hasValue } from '../../../shared/empty.util';
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, ResolveEnd, Router, RouterStateSnapshot } from '@angular/router';
import { BreadcrumbConfig } from '../../../breadcrumbs/breadcrumb/breadcrumb-config.model';
import { SubmissionObject } from '../../../core/submission/models/submission-object.model';

/**
 * This component triggers a page view statistic
 */
@Injectable({
  providedIn: 'root'
})
export class ViewTrackerResolverService {

  constructor(
    public angulartics2: Angulartics2,
    public referrerService: ReferrerService,
    public router: Router,
  ) {
  }

  resolve(routeSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const dsoPath = routeSnapshot.data['dsoPath'] || 'dso.payload'; // Fetch the resolvers passed via the route data
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
