import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RemoteData } from '../core/data/remote-data';
import { ItemDataService } from '../core/data/item-data.service';
import { Item } from '../core/shared/item.model';
import { hasValue } from '../shared/empty.util';
import { find } from 'rxjs/operators';

/**
 * This class represents a resolver that requests a specific item before the route is activated
 */
@Injectable()
export class ItemPageResolver implements Resolve<RemoteData<Item>> {
  constructor(private itemService: ItemDataService) {
  }

  /**
   * Method for resolving an item based on the parameters in the current route
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns Observable<<RemoteData<Item>> Emits the found item based on the parameters in the current route,
   * or an error if something went wrong
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RemoteData<Item>> {
    return this.itemService.findById(route.params.id)
      .pipe(
        find((RD) => hasValue(RD.error) || RD.hasSucceeded),
      );
  }
}
