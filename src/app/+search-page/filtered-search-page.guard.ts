import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  NavigationEnd,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { SearchFixedFilterService } from './search-filters/search-filter/search-fixed-filter.service';
import { map, take, tap, filter } from 'rxjs/operators';
import { isEmpty, isNotEmpty } from '../shared/empty.util';
import { Location } from '@angular/common';

@Injectable()
/**
 * Assemble the correct i18n key for the filtered search page's title depending on the current route's filter parameter.
 * The format of the key will be "{filter}.search.title" with:
 * - filter: The current filter stored in route.params
 */
export class FilteredSearchPageGuard implements CanActivate {
  constructor(private service: SearchFixedFilterService, private router: Router, private location: Location) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    route.params = Object.assign({}, route.params, { filter: route.params.filter.toLowerCase() });
    const filterName = route.params.filter;

    const newTitle = filterName + '.search.title';

    route.data = { title: newTitle };

    return this.service.getQueryByFilterName(filterName).pipe(
      tap((query) => {
          if (isEmpty(query)) {
            this.router.navigateByUrl('/404', { skipLocationChange: true });
            this.router.events
              .pipe(
                filter((event) => event instanceof NavigationEnd),
                take(1)
              )
              .subscribe(() => this.location.replaceState(state.url));
          }
        }
      ),
      map((query) => isNotEmpty(query))
    );
  }
}
