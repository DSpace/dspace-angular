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
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DSpaceObjectDataService } from '../../../core/data/dspace-object-data.service';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { AbstractRouteContextMenuProvider } from './route-context.menu';

export abstract class DSpaceObjectPageMenuProvider<T extends DSpaceObject> extends AbstractRouteContextMenuProvider<T> {
  allRoutes = false;

  protected constructor(
    protected dsoDataService: DSpaceObjectDataService,
  ) {
    super();
  }


  public getRouteContext(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<T | undefined> {
    // todo: would be cool to automatically switch to cached version of specific DSO
    //       ...but we can't really know which is which because the other resolver may run _after_
    //       we could refactor the resolver to a function though; then it's less problematic to just call it here
    return this.dsoDataService.findById(route.params.id, true, false).pipe(
      getFirstCompletedRemoteData(),
      map((dsoRD) => {
        if (dsoRD.hasSucceeded) {
          return dsoRD.payload as T;
        } else {
          return undefined;
        }
      })
    );
  }

  /**
   * Retrieve the dso or entity type for an object to be used in generic messages
   */
  protected getDsoType(dso: T) {
    const renderType = dso.getRenderTypes()[0];
    if (typeof renderType === 'string' || renderType instanceof String) {
      return renderType.toLowerCase();
    } else {
      return dso.type.toString().toLowerCase();
    }
  }
}
