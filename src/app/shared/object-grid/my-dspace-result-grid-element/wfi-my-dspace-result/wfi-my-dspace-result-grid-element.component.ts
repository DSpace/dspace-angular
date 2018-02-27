import { Component, Inject } from '@angular/core';
import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { ViewMode } from '../../../../+search-page/search-options.model';
import { Item } from '../../../../core/shared/item.model';
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
import { MyDSpaceResultGridElementComponent } from '../my-dspace-result-grid-element.component';

@Component({
  selector: 'ds-workflowitem-my-dspace-result-grid-element',
  styleUrls: ['../my-dspace-result-grid-element.component.scss'],
  templateUrl: './wfi-my-dspace-result-grid-element.component.html',
})

@renderElementsFor(WorkflowitemMyDSpaceResult, ViewMode.Grid)
@renderElementsFor(Workflowitem, ViewMode.Grid)
export class WorkflowitemMyDSpaceResultGridElementComponent extends MyDSpaceResultGridElementComponent<WorkflowitemMyDSpaceResult, Workflowitem> {
  public item: Item;
  public submitter: Eperson;
  public user: Eperson;

  constructor(private modalService: NgbModal,
              private store: Store<AppState>,
              private wfiDataService: WorkflowitemDataService,
              @Inject('objectElementProvider') public listable: ListableObject) {
    super(listable);
  }

  ngOnInit() {
    this.initItem(this.dso.item as Observable<RemoteData<Item[]>>);

    (this.dso.submitter as Observable<RemoteData<Eperson[]>>)
      .filter((rd: RemoteData<any>) => ((!rd.isRequestPending) && hasNoUndefinedValue(rd.payload)))
      .first()
      .subscribe((rd: RemoteData<any>) => {
        // console.log(rd);
        this.submitter = rd.payload[0];
      });

    this.store.select(getAuthenticatedUser)
      .filter((user: Eperson) => isNotEmpty(user))
      .take(1)
      .subscribe((user: Eperson) => {
        this.user = user;
      });

  }

  initItem(itemObs: Observable<RemoteData<Item[]>>) {
    itemObs
      .filter((rd: RemoteData<any>) => ((!rd.isRequestPending) && hasNoUndefinedValue(rd.payload)))
      .first()
      .subscribe((rd: RemoteData<any>) => {
        this.item = rd.payload[0];
      });
  }

}
