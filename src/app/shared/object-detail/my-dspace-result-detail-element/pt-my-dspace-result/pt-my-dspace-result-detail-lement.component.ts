import { Component, Inject } from '@angular/core';
import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { ViewMode } from '../../../../+search-page/search-options.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { Observable } from 'rxjs/Observable';
import { hasNoUndefinedValue } from '../../../empty.util';
import { ListableObject } from '../../../object-collection/shared/listable-object.model';
import { Workflowitem } from '../../../../core/submission/models/workflowitem.model';
import { PoolTask } from '../../../../core/tasks/models/pool-task-object.model';
import { PoolTaskMyDSpaceResult } from '../../../object-collection/shared/pool-task-my-dspace-result.model';
import { PoolTaskDataService } from '../../../../core/tasks/pool-task-data.service';
import { Router } from '@angular/router';
import { MyDSpaceResultDetailElementComponent } from '../my-dspace-result-detail-element.component';
import { ItemStatusType } from '../../../object-collection/shared/mydspace-item-status/item-status-type';

@Component({
  selector: 'ds-pooltask-my-dspace-result-detail-element',
  styleUrls: ['../my-dspace-result-detail-element.component.scss'],
  templateUrl: './pt-my-dspace-result-detail-element.component.html',
})

@renderElementsFor(PoolTaskMyDSpaceResult, ViewMode.Detail)
@renderElementsFor(PoolTask, ViewMode.Detail)
export class PoolTaskMyDSpaceResultDetailElementComponent extends MyDSpaceResultDetailElementComponent<PoolTaskMyDSpaceResult, PoolTask> {
  public status = ItemStatusType.WAITING_CONTROLLER;
  public workFlow: Workflowitem;

  constructor(@Inject('objectElementProvider') public listable: ListableObject) {

    super(listable);
  }

  ngOnInit() {
    this.initItem(this.dso.workflowitem as Observable<RemoteData<Workflowitem[]>>);
  }

  initItem(wfiObs: Observable<RemoteData<Workflowitem[]>>) {
    wfiObs
      .filter((rd: RemoteData<any>) => ((!rd.isRequestPending) && hasNoUndefinedValue(rd.payload)))
      .take(1)
      .subscribe((rd: RemoteData<any>) => {
        this.workFlow = rd.payload[0];
      });
  }

}
