import { Component, Inject } from '@angular/core';

import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { Item } from '../../../../core/shared/item.model';
import { ListableObject } from '../../../object-collection/shared/listable-object.model';
import { WorkflowitemMyDSpaceResult } from '../../../object-collection/shared/workflowitem-my-dspace-result.model';
import { WorkflowItem } from '../../../../core/submission/models/workflowitem.model';
import { MyDSpaceResultDetailElementComponent } from '../my-dspace-result-detail-element.component';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { Observable } from 'rxjs/internal/Observable';
import { RemoteData } from '../../../../core/data/remote-data';
import { find } from 'rxjs/operators';
import { isNotUndefined } from '../../../empty.util';
import { SetViewMode } from '../../../view-mode';

/**
 * This component renders workflowitem object for the mydspace result in the detail view.
 */
@Component({
  selector: 'ds-workflowitem-my-dspace-result-detail-element',
  styleUrls: ['../my-dspace-result-detail-element.component.scss'],
  templateUrl: './workflowitem-my-dspace-result-detail-element.component.html',
})

@renderElementsFor(WorkflowitemMyDSpaceResult, SetViewMode.Detail)
@renderElementsFor(WorkflowItem, SetViewMode.Detail)
export class WorkflowitemMyDSpaceResultDetailElementComponent extends MyDSpaceResultDetailElementComponent<WorkflowitemMyDSpaceResult, WorkflowItem> {

  /**
   * The item object that belonging to the result object
   */
  public item: Item;

  /**
   * Represent item's status
   */
  public status = MyDspaceItemStatusType.WORKFLOW;

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
