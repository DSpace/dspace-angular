import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { RemoteData } from '../core/data/remote-data';
import { getSucceededRemoteData } from '../core/shared/operators';
import { ItemDataService } from '../core/data/item-data.service';
import { Item } from '../core/shared/item.model';

@Injectable()
export class ItemPageResolver implements Resolve<RemoteData<Item>> {
  constructor(private itemService: ItemDataService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RemoteData<Item>> {
    return this.itemService.findById(route.params.id).pipe(
      getSucceededRemoteData()
    );
  }
}
