import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RemoteData } from '../core/data/remote-data';
import { Item } from '../core/shared/item.model';
import { followLink } from '../shared/utils/follow-link-config.model';
import { getFirstCompletedRemoteData } from '../core/shared/operators';
import { Store } from '@ngrx/store';
import { WorkflowItemDataService } from '../core/submission/workflowitem-data.service';
import { WorkflowItem } from '../core/submission/models/workflowitem.model';
import { switchMap } from 'rxjs/operators';

/**
 * This class represents a resolver that requests a specific item before the route is activated
 */
@Injectable()
export class ItemFromWorkflowResolver implements Resolve<RemoteData<Item>> {
  constructor(
    private workflowItemService: WorkflowItemDataService,
    protected store: Store<any>
  ) {
  }

  /**
   * Method for resolving an item based on the parameters in the current route
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns Observable<<RemoteData<Item>> Emits the found item based on the parameters in the current route,
   * or an error if something went wrong
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RemoteData<Item>> {
    const itemRD$ = this.workflowItemService.findById(route.params.id,
      true,
      false,
      followLink('item'),
    ).pipe(
      getFirstCompletedRemoteData(),
      switchMap((wfiRD: RemoteData<WorkflowItem>) => wfiRD.payload.item as Observable<RemoteData<Item>>),
      getFirstCompletedRemoteData()
    );
    return itemRD$;
  }
}
