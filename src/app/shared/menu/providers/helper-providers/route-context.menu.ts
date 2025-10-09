/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import {
  Observable,
  of,
} from 'rxjs';
import { switchMap } from 'rxjs/operators';

import {
  AbstractMenuProvider,
  PartialMenuSection,
} from '../../menu-provider.model';

/**
 * Helper provider for route dependent menus
 */
export abstract class AbstractRouteContextMenuProvider<T> extends AbstractMenuProvider {
  shouldPersistOnRouteChange = false;

  abstract getRouteContext(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<T | undefined>;

  abstract getSectionsForContext(routeContext: T): Observable<PartialMenuSection[]>;

  getSections(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PartialMenuSection[]> {

    return this.getRouteContext(route, state).pipe(
      switchMap((routeContext: T) => {
        if (this.isApplicable(routeContext)) {
          return this.getSectionsForContext(routeContext);
        } else {
          return of([]);
        }
      }),
    );
  }

  protected isApplicable(routeContext: T): boolean {
    return true;
  }
}
