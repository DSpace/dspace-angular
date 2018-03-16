import { Component, Inject } from '@angular/core';
import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { MyDSpaceResultListElementComponent, } from '../my-dspace-result-list-element.component';
import { ViewMode } from '../../../../+search-page/search-options.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { Observable } from 'rxjs/Observable';
import { hasNoUndefinedValue } from '../../../empty.util';
import { ListableObject } from '../../../object-collection/shared/listable-object.model';
import { Workflowitem } from '../../../../core/submission/models/workflowitem.model';
import { ClaimedTask } from '../../../../core/tasks/models/claimed-task-object.model';
import { ClaimedTaskMyDSpaceResult } from '../../../object-collection/shared/claimed-task-my-dspace-result.model';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { ItemStatusType } from '../../item-list-status/item-status-type';

@Component({
  selector: 'ds-claimtask-my-dspace-result-list-element',
  styleUrls: ['../my-dspace-result-list-element.component.scss'],
  templateUrl: './ct-my-dspace-result-list-element.component.html',
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}]
})

@renderElementsFor(ClaimedTaskMyDSpaceResult, ViewMode.List)
@renderElementsFor(ClaimedTask, ViewMode.List)
export class ClaimedTaskMyDSpaceResultListElementComponent extends MyDSpaceResultListElementComponent<ClaimedTaskMyDSpaceResult, ClaimedTask> {
  public status = ItemStatusType.VALIDATION;
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
      .first()
      .subscribe((rd: RemoteData<any>) => {
        this.workFlow = rd.payload[0];
      });
  }
}
