import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute, Data } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';import { RemoteData } from '../../core/data/remote-data';

import {
  getAllSucceededRemoteData,
  getRemoteDataPayload
} from '../../core/shared/operators';
import { WorkflowItem } from '../../core/submission/models/workflowitem.model';
import { Item } from '../../core/shared/item.model';
import { ViewMode } from '../../core/shared/view-mode.model';

@Component({
  selector: 'ds-workflow-item-view',
  templateUrl: './workflow-item-view.component.html'
})
/**
 * Component representing a page to delete a workflow item
 */
export class WorkflowItemViewComponent implements OnInit {

  public wfi$: Observable<WorkflowItem>;
  public itemRD$: Observable<RemoteData<Item>>;

  /**
   * The view-mode we're currently on
   */
  viewMode = ViewMode.StandalonePage;


  constructor(protected route: ActivatedRoute) {
  }

  ngOnInit() {
    this.wfi$ = this.route.data.pipe(map((data: Data) => data.wfi as RemoteData<WorkflowItem>), getRemoteDataPayload());
    this.itemRD$ = this.wfi$.pipe(switchMap((wfi: WorkflowItem) => (wfi.item as Observable<RemoteData<Item>>).pipe(getAllSucceededRemoteData())));
  }

}
