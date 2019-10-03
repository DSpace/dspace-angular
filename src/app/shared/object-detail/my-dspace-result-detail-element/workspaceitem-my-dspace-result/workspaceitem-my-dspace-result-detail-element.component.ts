import { Component, Inject } from '@angular/core';

import { Observable } from 'rxjs';
import { find } from 'rxjs/operators';

import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import {
  WorkspaceItem
} from '../../../../core/submission/models/workspaceitem.model';
import { WorkspaceitemMyDSpaceResult } from '../../../object-collection/shared/workspaceitem-my-dspace-result.model';
import { Item } from '../../../../core/shared/item.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { isNotUndefined } from '../../../empty.util';
import { ListableObject } from '../../../object-collection/shared/listable-object.model';
import { MyDSpaceResultDetailElementComponent } from '../my-dspace-result-detail-element.component';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { SetViewMode } from '../../../view-mode';

/**
 * This component renders workspaceitem object for the mydspace result in the detail view.
 */
@Component({
  selector: 'ds-workspaceitem-my-dspace-result-detail-element',
  styleUrls: ['../my-dspace-result-detail-element.component.scss', './workspaceitem-my-dspace-result-detail-element.component.scss'],
  templateUrl: './workspaceitem-my-dspace-result-detail-element.component.html',
})

@renderElementsFor(WorkspaceitemMyDSpaceResult, SetViewMode.Detail)
@renderElementsFor(WorkspaceItem, SetViewMode.Detail)
export class WorkspaceitemMyDSpaceResultDetailElementComponent extends MyDSpaceResultDetailElementComponent<WorkspaceitemMyDSpaceResult, WorkspaceItem> {

  /**
   * The item object that belonging to the result object
   */
  public item: Item;

  /**
   * Represent item's status
   */
  status = MyDspaceItemStatusType.WORKSPACE;

  constructor(@Inject('objectElementProvider') public listable: ListableObject) {
    super(listable);
  }

  /**
   * Initialize all instance variables
   */
  ngOnInit() {
    this.initItem(this.dso.item as Observable<RemoteData<Item>>);
  }

  /**
   * Retrieve item from result object
   */
  initItem(item$: Observable<RemoteData<Item>>) {
    item$.pipe(
      find((rd: RemoteData<Item>) => rd.hasSucceeded && isNotUndefined(rd.payload))
    ).subscribe((rd: RemoteData<Item>) => {
      this.item = rd.payload;
    });
  }
}
