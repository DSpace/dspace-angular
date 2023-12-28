/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { Optional } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import {
  Observable,
  of,
} from 'rxjs';
import { map } from 'rxjs/operators';
import { DSpaceObjectDataService } from '../../../core/data/dspace-object-data.service';
import { RemoteData } from '../../../core/data/remote-data';
import { Item } from '../../../core/shared/item.model';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { ItemPageResolver } from '../../../item-page/item-page.resolver';
import { DSpaceObjectPageMenuProvider } from './dso.menu';

export abstract class ItemPageMenuProvider extends DSpaceObjectPageMenuProvider<Item> {
  allRoutes = false;

  protected constructor(
    protected dsoDataService: DSpaceObjectDataService,
    @Optional() protected resolver?: ItemPageResolver,
  ) {
    super(dsoDataService);
  }

  public getRouteContext(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Item | undefined> {
    if (this.resolver === null) {
      return of(undefined);
    }

    // todo: it should be better to reuse the exact resolver that the page uses already, since the RD is guaranteed to be cached already
    return (this.resolver.resolve(route, state) as Observable<RemoteData<Item>>).pipe(
      getFirstCompletedRemoteData(),
      map((dsoRD) => {
        if (dsoRD.hasSucceeded) {
          return dsoRD.payload;
        } else {
          return undefined;
        }
      })
    );
  }
}
