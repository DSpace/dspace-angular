import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Breadcrumb } from './breadcrumb/breadcrumb.model';
import { hasNoValue, hasValue, isUndefined } from '../shared/empty.util';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { combineLatest, Observable, Subscription, of as observableOf } from 'rxjs';

/**
 * Component representing the breadcrumbs of a page
 */
@Component({
  selector: 'ds-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {
  /**
   * List of breadcrumbs for this page
   */
  breadcrumbs: Breadcrumb[];

  /**
   * Whether or not to show breadcrumbs on this page
   */
  showBreadcrumbs: boolean;

  /**
   * Whether or not to show breadcrumbs with a fluid container
   */
  showBreadcrumbsFluid: boolean;

  /**
   * Subscription to unsubscribe from on destroy
   */
  subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  /**
   * Sets the breadcrumbs on init for this page
   */
  ngOnInit(): void {
    this.subscription = this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      tap(() => this.reset()),
      switchMap(() => this.resolveBreadcrumbs(this.route.root))
    ).subscribe((breadcrumbs) => {
        this.breadcrumbs = breadcrumbs;
      }
    )
  }

  /**
   * Method that recursively resolves breadcrumbs
   * @param route The route to get the breadcrumb from
   */
  resolveBreadcrumbs(route: ActivatedRoute): Observable<Breadcrumb[]> {
    const data = route.snapshot.data;
    const routeConfig = route.snapshot.routeConfig;

    const last: boolean = hasNoValue(route.firstChild);
    if (last) {
      if (hasValue(data.showBreadcrumbs)) {
        this.showBreadcrumbs = data.showBreadcrumbs;
      } else if (isUndefined(data.breadcrumb)) {
        this.showBreadcrumbs = false;
      }
      if (hasValue(data.showBreadcrumbsFluid)) {
        this.showBreadcrumbsFluid = data.showBreadcrumbsFluid;
      } else {
        this.showBreadcrumbsFluid = false;
      }
    }

    if (
      hasValue(data) && hasValue(data.breadcrumb) &&
      hasValue(routeConfig) && hasValue(routeConfig.resolve) && hasValue(routeConfig.resolve.breadcrumb)
    ) {
      const { provider, key, url } = data.breadcrumb;
      if (!last) {
        return combineLatest(provider.getBreadcrumbs(key, url), this.resolveBreadcrumbs(route.firstChild))
          .pipe(map((crumbs) => [].concat.apply([], crumbs)));
      } else {
        return provider.getBreadcrumbs(key, url);
      }
    }
    return !last ? this.resolveBreadcrumbs(route.firstChild) : observableOf([]);
  }

  /**
   * Unsubscribe from subscription
   */
  ngOnDestroy(): void {
    if (hasValue(this.subscription)) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Resets the state of the breadcrumbs
   */
  reset() {
    this.breadcrumbs = [];
    this.showBreadcrumbs = true;
  }
}
