import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Breadcrumb } from './breadcrumb/breadcrumb.model';
import { hasValue, isNotUndefined } from '../shared/empty.util';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { combineLatest, Observable, Subscription, of as observableOf } from 'rxjs';
import { BreadcrumbConfig } from './breadcrumb/breadcrumb-config.model';

@Component({
  selector: 'ds-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnDestroy {
  breadcrumbs: Breadcrumb[];
  showBreadcrumbs: boolean;
  subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.subscription = this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      tap(() => this.reset()),
      switchMap(() => this.resolveBreadcrumb(this.route.root))
    ).subscribe((breadcrumbs) => {
        this.breadcrumbs = breadcrumbs;
      }
    )
  }

  resolveBreadcrumb(route: ActivatedRoute): Observable<Breadcrumb[]> {
    const data = route.snapshot.data;
    const routeConfig = route.snapshot.routeConfig;

    const last: boolean = route.children.length === 0;
    if (last && isNotUndefined(data.showBreadcrumbs)) {
      this.showBreadcrumbs = data.showBreadcrumbs;
    }

    if (
      hasValue(data) && hasValue(data.breadcrumb) &&
      hasValue(routeConfig) && hasValue(routeConfig.resolve) && hasValue(routeConfig.resolve.breadcrumb)
    ) {
      const { provider, key, url } = data.breadcrumb;
      if (!last) {
        return combineLatest(provider.getBreadcrumbs(key, url), this.resolveBreadcrumb(route.firstChild))
          .pipe(map((crumbs) => [].concat.apply([], crumbs)));
      } else {
        return provider.getBreadcrumbs(key, url);
      }
    }
    return !last ? this.resolveBreadcrumb(route.firstChild) : observableOf([]);
  }

  ngOnDestroy(): void {
    if (hasValue(this.subscription)) {
      this.subscription.unsubscribe();
    }
  }

  reset() {
    this.breadcrumbs = [];
    this.showBreadcrumbs = true;
  }
}
