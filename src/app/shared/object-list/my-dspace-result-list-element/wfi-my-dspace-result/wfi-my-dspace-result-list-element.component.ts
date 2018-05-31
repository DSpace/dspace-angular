import { Component } from '@angular/core';
import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { MyDSpaceResultListElementComponent, } from '../my-dspace-result-list-element.component';
import { ViewMode } from '../../../../+search-page/search-options.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { Observable } from 'rxjs/Observable';
import { hasNoUndefinedValue } from '../../../empty.util';
import { WorkflowitemMyDSpaceResult } from '../../../object-collection/shared/workflowitem-my-dspace-result.model';
import { Workflowitem } from '../../../../core/submission/models/workflowitem.model';
import { Item } from '../../../../core/shared/item.model';
import { ItemStatusType } from '../../../object-collection/shared/mydspace-item-status/item-status-type';

@Component({
  selector: 'ds-workflowitem-my-dspace-result-list-element',
  styleUrls: ['../my-dspace-result-list-element.component.scss'],
  templateUrl: './wfi-my-dspace-result-list-element.component.html',
})

@renderElementsFor(WorkflowitemMyDSpaceResult, ViewMode.List)
@renderElementsFor(Workflowitem, ViewMode.List)
export class WorkflowitemMyDSpaceResultListElementComponent extends MyDSpaceResultListElementComponent<WorkflowitemMyDSpaceResult, Workflowitem> {
  public item: Item;
  public status = ItemStatusType.WORKFLOW;

  // constructor(@Inject('objectElementProvider') public listable: ListableObject) {
  //   super(listable);
  // }

  ngOnInit() {
    this.initItem(this.dso.item as Observable<RemoteData<Item[]>>);
  }

  initItem(itemObs: Observable<RemoteData<Item[]>>) {
    itemObs
      .filter((rd: RemoteData<any>) => ((!rd.isRequestPending) && hasNoUndefinedValue(rd.payload)))
      .take(1)
      .subscribe((rd: RemoteData<any>) => {
        this.item = rd.payload[0];
      });
  }

}
