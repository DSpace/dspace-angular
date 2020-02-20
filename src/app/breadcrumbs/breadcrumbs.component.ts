import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Breadcrumb } from './breadcrumb/breadcrumb.model';
import { hasValue, isNotUndefined } from '../shared/empty.util';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { combineLatest, Observable, Subscription } from 'rxjs';
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
    if (hasValue(data) && hasValue(data.breadcrumb)) {
      const { provider, key, url }: BreadcrumbConfig = data.breadcrumb;
      if (route.children.length > 0) {
        return combineLatest(provider.getBreadcrumbs(key, url), this.resolveBreadcrumb(route.firstChild))
          .pipe(map((crumbs) => [].concat.apply([], crumbs)));
      } else {
        if (isNotUndefined(data.showBreadcrumbs)) {
          this.showBreadcrumbs = data.showBreadcrumbs;
        }
        return provider.getBreadcrumbs(key, url);
      }
    }
    if (route.children.length > 0) {

      return this.resolveBreadcrumb(route.firstChild)
    }
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
