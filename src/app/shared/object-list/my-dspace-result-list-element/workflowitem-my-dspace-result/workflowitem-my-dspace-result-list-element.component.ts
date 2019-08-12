import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { find } from 'rxjs/operators';

import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { MyDSpaceResultListElementComponent, } from '../my-dspace-result-list-element.component';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { isNotUndefined } from '../../../empty.util';
import { WorkflowitemMyDSpaceResult } from '../../../object-collection/shared/workflowitem-my-dspace-result.model';
import { WorkflowItem } from '../../../../core/submission/models/workflowitem.model';
import { Item } from '../../../../core/shared/item.model';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { SetViewMode } from '../../../view-mode';

/**
 * This component renders workflowitem object for the mydspace result in the list view.
 */
@Component({
  selector: 'ds-workflowitem-my-dspace-result-list-element',
  styleUrls: ['../my-dspace-result-list-element.component.scss'],
  templateUrl: './workflowitem-my-dspace-result-list-element.component.html',
})

@renderElementsFor(WorkflowitemMyDSpaceResult, SetViewMode.List)
@renderElementsFor(WorkflowItem, SetViewMode.List)
export class WorkflowitemMyDSpaceResultListElementComponent extends MyDSpaceResultListElementComponent<WorkflowitemMyDSpaceResult, WorkflowItem> {

  /**
   * The item object that belonging to the result object
   */
  public item: Item;

  /**
   * Represent item's status
   */
  public status = MyDspaceItemStatusType.WORKFLOW;

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
