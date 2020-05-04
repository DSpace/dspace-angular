import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Collection } from '../core/shared/collection.model';
import { Observable } from 'rxjs';
import { CollectionDataService } from '../core/data/collection-data.service';
import { RemoteData } from '../core/data/remote-data';
import { find } from 'rxjs/operators';
import { hasValue } from '../shared/empty.util';
import { followLink } from '../shared/utils/follow-link-config.model';

/**
 * This class represents a resolver that requests a specific collection before the route is activated
 */
@Injectable()
export class CollectionPageResolver implements Resolve<RemoteData<Collection>> {
  constructor(private collectionService: CollectionDataService) {
  }

  /**
   * Method for resolving a collection based on the parameters in the current route
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns Observable<<RemoteData<Collection>> Emits the found collection based on the parameters in the current route,
   * or an error if something went wrong
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RemoteData<Collection>> {
    return this.collectionService.findById(route.params.id, followLink('logo')).pipe(
      find((RD) => hasValue(RD.error) || RD.hasSucceeded),
    );
  }
}
