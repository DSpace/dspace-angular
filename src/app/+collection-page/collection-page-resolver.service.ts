import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Collection } from '../core/shared/collection.model';
import { Observable } from 'rxjs/Observable';
import { CollectionDataService } from '../core/data/collection-data.service';
import { RemoteData } from '../core/data/remote-data';
import { filter, first, takeUntil } from 'rxjs/operators';

@Injectable()
export class CollectionPageResolverService implements Resolve<RemoteData<Collection>> {
  constructor(private collectionService: CollectionDataService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RemoteData<Collection>> {
    return this.collectionService.findById(route.params.id).pipe(
      filter((rd: RemoteData<Collection>) => rd.hasSucceeded),
      first()
    );
  }
}
