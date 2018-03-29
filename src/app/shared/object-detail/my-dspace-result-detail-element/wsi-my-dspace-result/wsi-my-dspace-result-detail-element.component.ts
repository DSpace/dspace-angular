import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { ViewMode } from '../../../../+search-page/search-options.model';
import { Workspaceitem } from '../../../../core/submission/models/workspaceitem.model';
import { WorkspaceitemMyDSpaceResult } from '../../../object-collection/shared/workspaceitem-my-dspace-result.model';
import { Item } from '../../../../core/shared/item.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { Observable } from 'rxjs/Observable';
import { hasNoUndefinedValue } from '../../../empty.util';
import { ListableObject } from '../../../object-collection/shared/listable-object.model';
import { WorkspaceitemDataService } from '../../../../core/submission/workspaceitem-data.service';
import { MyDSpaceResultDetailElementComponent } from '../my-dspace-result-detail-element.component';
import { ItemStatusType } from '../../../object-list/item-list-status/item-status-type';
import { Router } from '@angular/router';
import { SubmissionRestService } from '../../../../submission/submission-rest.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ds-workspaceitem-my-dspace-result-detail-element',
  styleUrls: ['../my-dspace-result-detail-element.component.scss', './wsi-my-dspace-result-detail-element.component.scss'],
  templateUrl: './wsi-my-dspace-result-detail-element.component.html',
})

@renderElementsFor(WorkspaceitemMyDSpaceResult, ViewMode.Detail)
@renderElementsFor(Workspaceitem, ViewMode.Detail)
export class WorkspaceitemMyDSpaceResultDetailElementComponent extends MyDSpaceResultDetailElementComponent<WorkspaceitemMyDSpaceResult, Workspaceitem> {
  public item: Item;
  status = ItemStatusType.IN_PROGRESS;

  constructor(private cdr: ChangeDetectorRef,
              private wsiDataService: WorkspaceitemDataService,
              private modalService: NgbModal,
              private restService: SubmissionRestService,
              private router: Router,
              @Inject('objectElementProvider') public listable: ListableObject) {
    super(listable);
  }

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

  refresh() {
    this.wsiDataService.findById(this.dso.id)
      .filter((wsi: RemoteData<Workspaceitem>) => wsi.hasSucceeded)
      .take(1)
      .subscribe((wsi) => {
        // console.log('Refresh wsi...');
        this.dso = wsi.payload;
        this.initItem(this.dso.item as Observable<RemoteData<Item[]>>);
      });
  }

  public confirmDiscard(content) {
    this.modalService.open(content).result.then(
      (result) => {
        if (result === 'ok') {
          this.restService.deleteById(this.dso.id)
            .subscribe((response) => {
              this.reload();
            })
        }
      }
    );
  }

  reload() {
    // override the route reuse strategy
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
    this.router.navigated = false;
    const url = decodeURIComponent(this.router.url);
    this.router.navigateByUrl(url);
  }

}
