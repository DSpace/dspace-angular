import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Collection } from '../core/shared/collection.model';
import { Observable } from 'rxjs';
import { CollectionDataService } from '../core/data/collection-data.service';
import { RemoteData } from '../core/data/remote-data';
import { getSucceededRemoteData } from '../core/shared/operators';

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
   * @returns Observable<<RemoteData<Collection>> Emits the found collection based on the parameters in the current route
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RemoteData<Collection>> {
    return this.collectionService.findById(route.params.id).pipe(
      getSucceededRemoteData()
    );
  }
}
