import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Breadcrumb } from './breadcrumb/breadcrumb.model';
import { hasNoValue, hasValue, isUndefined } from '../shared/empty.util';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { combineLatest, Observable, of as observableOf, Subscription } from 'rxjs';

/**
 * Component representing the breadcrumbs of a page
 */
@Component({
  selector: 'ds-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {
  /**
   * Observable of the list of breadcrumbs for this page
   */
  breadcrumbs$: Observable<Breadcrumb[]>;

  /**
   * Whether or not to show breadcrumbs on this page
   */
  showBreadcrumbs: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  /**
   * Sets the breadcrumbs on init for this page
   */
  ngOnInit(): void {
    this.breadcrumbs$ = this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      tap(() => this.reset()),
      switchMap(() => this.resolveBreadcrumbs(this.route.root)),
    );
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
   * Resets the state of the breadcrumbs
   */
  reset() {
    this.showBreadcrumbs = true;
  }
}
