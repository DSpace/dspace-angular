import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
/**
 * Assemble the correct i18n key for the filtered search page's title depending on the current route's filter parameter.
 * The format of the key will be "{filter}.search.title" with:
 * - filter: The current filter stored in route.params
 */
export class FilteredSearchPageGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const filter = route.params.filter;

    const newTitle = filter + '.search.title';

    route.data = { title: newTitle };
    return true;
  }
}
