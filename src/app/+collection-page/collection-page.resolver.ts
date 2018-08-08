import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Collection } from '../core/shared/collection.model';
import { Observable } from 'rxjs/Observable';
import { CollectionDataService } from '../core/data/collection-data.service';
import { RemoteData } from '../core/data/remote-data';
import { getSucceededRemoteData } from '../core/shared/operators';

@Injectable()
export class CollectionPageResolver implements Resolve<RemoteData<Collection>> {
  constructor(private collectionService: CollectionDataService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RemoteData<Collection>> {

    return this.collectionService.findById(route.params.id).pipe(
      getSucceededRemoteData()
    );
  }
}
