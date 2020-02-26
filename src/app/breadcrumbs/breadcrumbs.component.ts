import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Breadcrumb } from './breadcrumb/breadcrumb.model';
import { hasNoValue, hasValue, isNotUndefined } from '../shared/empty.util';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { combineLatest, Observable, Subscription, of as observableOf } from 'rxjs';

@Component({
  selector: 'ds-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {
  breadcrumbs: Breadcrumb[];
  showBreadcrumbs: boolean;
  subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

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

  resolveBreadcrumbs(route: ActivatedRoute): Observable<Breadcrumb[]> {
    const data = route.snapshot.data;
    const routeConfig = route.snapshot.routeConfig;

    const last: boolean = hasNoValue(route.firstChild);
    if (last && isNotUndefined(data.showBreadcrumbs)) {
      this.showBreadcrumbs = data.showBreadcrumbs;
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
