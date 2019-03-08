import { Component, Inject, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { find, first } from 'rxjs/operators';

import { renderElementsFor } from '../../../object-collection/shared/dso-element-decorator';
import { MyDSpaceResultListElementComponent, } from '../my-dspace-result-list-element.component';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { hasValue, isNotUndefined } from '../../../empty.util';
import { ListableObject } from '../../../object-collection/shared/listable-object.model';
import { Workflowitem } from '../../../../core/submission/models/workflowitem.model';
import { PoolTask } from '../../../../core/tasks/models/pool-task-object.model';
import { PoolTaskMyDSpaceResult } from '../../../object-collection/shared/pool-task-my-dspace-result.model';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MyDspaceItemStatusType } from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { MYDSPACE_ROUTE } from '../../../../+my-dspace-page/my-dspace-page.component';

@Component({
  selector: 'ds-pooltask-my-dspace-result-list-element',
  styleUrls: ['../my-dspace-result-list-element.component.scss'],
  templateUrl: './pt-my-dspace-result-list-element.component.html',
})

@renderElementsFor(PoolTaskMyDSpaceResult, ViewMode.List)
@renderElementsFor(PoolTask, ViewMode.List)
export class PoolTaskMyDSpaceResultListElementComponent extends MyDSpaceResultListElementComponent<PoolTaskMyDSpaceResult, PoolTask> implements OnDestroy, OnInit {
  public status = MyDspaceItemStatusType.WAITING_CONTROLLER;
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
    this.initWorkflowItem(this.dso.workflowitem as Observable<RemoteData<Workflowitem>>);
  }

  initWorkflowItem(wfi$: Observable<RemoteData<Workflowitem>>) {
    wfi$.pipe(
      find((rd: RemoteData<Workflowitem>) => (rd.hasSucceeded && isNotUndefined(rd.payload)))
    ).subscribe((rd: RemoteData<Workflowitem>) => {
      this.workFlow = rd.payload;
    });
  }

  switchView() {
    this.viewMode = (this.viewMode === ViewMode.List) ? ViewMode.Detail : ViewMode.List;
  }

  view() {
    this.sub = this.route.queryParams.pipe(
      first()
    ).subscribe((params) => {
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
      this.router.navigate([MYDSPACE_ROUTE], navigationExtras);
    });
  }

  ngOnDestroy() {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
  }

}
