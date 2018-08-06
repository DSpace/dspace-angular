import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Collection } from '../core/shared/collection.model';
import { Observable } from 'rxjs/Observable';
import { CollectionDataService } from '../core/data/collection-data.service';
import { RemoteData } from '../core/data/remote-data';
import { filter } from 'rxjs/operators';

@Injectable()
export class CollectionPageResolverService implements Resolve<RemoteData<Collection>> {
  constructor(private collectionService: CollectionDataService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RemoteData<Collection>> | Promise<RemoteData<Collection>> | RemoteData<Collection> {
    const id = route.params.id;
    console.log(id);
    // const collection = this.collectionService.findById(id).pipe(filter((c) => c.hasSucceeded));
    return this.collectionService.findById(id).pipe(filter((c) => c.hasSucceeded));
    // return Observable.of(new RemoteData(false, false, true, null, new Collection()));
  }
}
