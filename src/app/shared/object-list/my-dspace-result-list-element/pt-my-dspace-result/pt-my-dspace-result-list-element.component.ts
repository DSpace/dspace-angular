import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { MyDSpaceResultListElementComponent, } from '../my-dspace-result-list-element.component';
import { ViewMode } from '../../../../+search-page/search-options.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { Observable } from 'rxjs/Observable';
import { hasNoUndefinedValue, hasValue } from '../../../empty.util';
import { ListableObject } from '../../../object-collection/shared/listable-object.model';
import { Workflowitem } from '../../../../core/submission/models/workflowitem.model';
import { PoolTask } from '../../../../core/tasks/models/pool-task-object.model';
import { PoolTaskMyDSpaceResult } from '../../../object-collection/shared/pool-task-my-dspace-result.model';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ItemStatusType } from '../../../object-collection/shared/mydspace-item-status/item-status-type';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'ds-pooltask-my-dspace-result-list-element',
  styleUrls: ['../my-dspace-result-list-element.component.scss'],
  templateUrl: './pt-my-dspace-result-list-element.component.html',
})

@renderElementsFor(PoolTaskMyDSpaceResult, ViewMode.List)
@renderElementsFor(PoolTask, ViewMode.List)
export class PoolTaskMyDSpaceResultListElementComponent extends MyDSpaceResultListElementComponent<PoolTaskMyDSpaceResult, PoolTask> implements OnDestroy, OnInit {
  public status = ItemStatusType.WAITING_CONTROLLER;
  public workFlow: Workflowitem;
  public viewMode: ViewMode = ViewMode.List;
  private sub: Subscription;

  constructor(@Inject('objectElementProvider') public listable: ListableObject,
              @Inject('indexElementProvider') public index: number,
              private route: ActivatedRoute,
              private router: Router) {
    super(listable, index);
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

  switchView() {
    this.viewMode = (this.viewMode === ViewMode.List) ? ViewMode.Detail : ViewMode.List;
  }

  view() {
    this.sub = this.route.queryParams
      .take(1)
      .subscribe((params) => {
        const pageSize = params.pageSize || 1;
        const page = (pageSize * this.dsoIndex ) + 1;

        const navigationExtras: NavigationExtras = {
          queryParams: {
            view: ViewMode.Detail,
            page,
            pageSize
          },
          queryParamsHandling: 'merge'
        };
        this.router.navigate(['/mydspace'], navigationExtras);
      });
  }

  ngOnDestroy() {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
  }

}
