import { DSpaceObject } from './../dspace-object.model';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RemoteData } from '../../../core/data/remote-data';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';

import { ChildHALResource } from '../child-hal-resource.model';
import { IdentifiableDataService } from '../../data/base/identifiable-data.service';

/**
 * This class represents a resolver that requests a specific DSpaceObject before the route is activated
 */
@Injectable()
export abstract class EditDsoResolver<T extends ChildHALResource & DSpaceObject> implements Resolve<Observable<RemoteData<T>>> {
  constructor(
    protected dataService: IdentifiableDataService<T>,
  ) {
  }

  /**
   * Method for resolving an DSpaceObject based on the parameters in the current route
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns Observable<<RemoteData<DSpaceObject>> Emits the found item based on the parameters in the current route,
   * or an error if something went wrong
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RemoteData<T>> {
    const itemRD$ = this.dataService.findByIdWithProjections(route.params.id,
      ['allLanguages'],
      true,
      false,
      ...this.getFollowLinks()
    ).pipe(
      getFirstCompletedRemoteData(),
    );

    return itemRD$;
  }

  abstract getFollowLinks();
}
