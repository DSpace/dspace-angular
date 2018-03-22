import { Component, Inject } from '@angular/core';
import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { MyDSpaceResultListElementComponent, } from '../my-dspace-result-list-element.component';
import { ViewMode } from '../../../../+search-page/search-options.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { Observable } from 'rxjs/Observable';
import { hasNoUndefinedValue, isNotEmpty } from '../../../empty.util';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ListableObject } from '../../../object-collection/shared/listable-object.model';
import { Eperson } from '../../../../core/eperson/models/eperson.model';
import { AppState } from '../../../../app.reducer';
import { Store } from '@ngrx/store';
import { getAuthenticatedUser } from '../../../../core/auth/selectors';
import { WorkflowitemMyDSpaceResult } from '../../../object-collection/shared/workflowitem-my-dspace-result.model';
import { Workflowitem } from '../../../../core/submission/models/workflowitem.model';
import { WorkflowitemDataService } from '../../../../core/submission/workflowitem-data.service';
import { ItemStatusType } from '../../item-list-status/item-status-type';
import { Item } from '../../../../core/shared/item.model';

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
  public submitter: Observable<Eperson>;

  constructor(private modalService: NgbModal,
              private wfiDataService: WorkflowitemDataService,
              @Inject('objectElementProvider') public listable: ListableObject) {
    super(listable);
  }

  ngOnInit() {
    this.initItem(this.dso.item as Observable<RemoteData<Item[]>>);

    this.submitter = (this.dso.submitter as Observable<RemoteData<Eperson[]>>)
      .filter((rd: RemoteData<Eperson[]>) => rd.hasSucceeded && isNotEmpty(rd.payload))
      .take(1)
      .map((rd: RemoteData<Eperson[]>) => rd.payload[0]);
  }

  refresh() {
    // TODO Call a rest api to refresh the item
    // Wait some ms before, so previous call can be served
    this.wfiDataService.findById(this.dso.id)
      .filter((wfi: RemoteData<Workflowitem>) => wfi.hasSucceeded)
      .take(1)
      .subscribe((wfi) => {
        // console.log('Refresh wsi...');
        this.dso = wfi.payload;
        this.initItem(this.dso.item as Observable<RemoteData<Item[]>>);
      });
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
