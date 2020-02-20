import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Breadcrumb } from './breadcrumb/breadcrumb.model';
import { hasValue, isNotUndefined } from '../shared/empty.util';
import { filter, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ds-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnDestroy {
  breadcrumbs;
  showBreadcrumbs;
  subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.subscription = this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe(() => {
        this.reset();
        this.resolveBreadcrumb(this.route.root);
      }
    )
  }

  resolveBreadcrumb(route: ActivatedRoute) {
    const data = route.snapshot.data;
    if (hasValue(data) && hasValue(data.breadcrumb)) {
      this.breadcrumbs.push(data.breadcrumb);
    }
    if (route.children.length > 0) {
      this.resolveBreadcrumb(route.firstChild);
    } else if (isNotUndefined(data.showBreadcrumbs)) {
      this.showBreadcrumbs = data.showBreadcrumbs;
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
