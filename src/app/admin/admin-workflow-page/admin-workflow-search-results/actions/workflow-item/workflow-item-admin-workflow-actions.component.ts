import {
  NgClass,
  NgIf,
} from '@angular/common';
import {
  Component,
  Injector,
  Input,
} from '@angular/core';
import {
  Router,
  RouterLink,
} from '@angular/router';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  map,
  Observable,
  of,
} from 'rxjs';
import {
  catchError,
  switchMap,
} from 'rxjs/operators';

import { RemoteData } from '../../../../../core/data/remote-data';
import { RequestService } from '../../../../../core/data/request.service';
import { DSpaceObject } from '../../../../../core/shared/dspace-object.model';
import { Item } from '../../../../../core/shared/item.model';
import { getFirstSucceededRemoteData } from '../../../../../core/shared/operators';
import { SearchService } from '../../../../../core/shared/search/search.service';
import { WorkflowItem } from '../../../../../core/submission/models/workflowitem.model';
import { WorkspaceItem } from '../../../../../core/submission/models/workspaceitem.model';
import { ClaimedTaskDataService } from '../../../../../core/tasks/claimed-task-data.service';
import { ClaimedTask } from '../../../../../core/tasks/models/claimed-task-object.model';
import { CLAIMED_TASK } from '../../../../../core/tasks/models/claimed-task-object.resource-type';
import { PoolTaskDataService } from '../../../../../core/tasks/pool-task-data.service';
import { ITEM_EDIT_AUTHORIZATIONS_PATH } from '../../../../../item-page/edit-item-page/edit-item-page.routing-paths';
import { MyDSpaceReloadableActionsComponent } from '../../../../../shared/mydspace-actions/mydspace-reloadable-actions';
import { NotificationsService } from '../../../../../shared/notifications/notifications.service';
import {
  getWorkflowItemDeleteRoute,
  getWorkflowItemSendBackRoute,
} from '../../../../../workflowitems-edit-page/workflowitems-edit-page-routing-paths';

@Component({
  selector: 'ds-workflow-item-admin-workflow-actions-element',
  styleUrls: ['./workflow-item-admin-workflow-actions.component.scss'],
  templateUrl: './workflow-item-admin-workflow-actions.component.html',
  standalone: true,
  imports: [NgClass, RouterLink, NgIf, TranslateModule],
})
/**
 * The component for displaying the actions for a list element for a workflow-item on the admin workflow search page
 */
export class WorkflowItemAdminWorkflowActionsComponent extends MyDSpaceReloadableActionsComponent<ClaimedTask, ClaimedTaskDataService> {

  /**
   * The workflow item to perform the actions on
   */
  @Input() public wfi: WorkflowItem;

  @Input() public wsi: WorkspaceItem;

  object: ClaimedTask;

  /**
   * The item object that belonging to the ClaimedTask object
   */
  @Input() public item: Item;

  option: string;

  /**
   * Anchor used to reload the pool task.
   */
  @Input() itemUuid: string;

  resourcePoliciesPageRoute: string[];

  subs = [];

  showButton = false;

  isLoading = false;

  /**
   * Whether to use small buttons or not
   */
  @Input() public small: boolean;

  constructor(protected injector: Injector,
              protected router: Router,
              protected notificationsService: NotificationsService,
              protected translate: TranslateService,
              protected searchService: SearchService,
              protected requestService: RequestService,
              protected poolTaskDataService: PoolTaskDataService,
              protected claimedTaskDataService: ClaimedTaskDataService) {
    super(CLAIMED_TASK, injector, router, notificationsService, translate, searchService, requestService);
  }

  /**
   * Returns the path to the delete page of this workflow item
   */
  getDeleteRoute(): string {
    return getWorkflowItemDeleteRoute(this.wfi.id);
  }

  /**
   * Returns the path to the send back page of this workflow item
   */
  getSendBackRoute(): string {
    return getWorkflowItemSendBackRoute(this.wfi.id);
  }

  returnTaskToPool(): void {
    this.isLoading = true;
    this.wfi.item.pipe(
      getFirstSucceededRemoteData(),
      switchMap((item: any) => this.claimedTaskDataService.findByItem(item.payload.id)),
      getFirstSucceededRemoteData(),
      switchMap((poolTask: any) => this.objectDataService.returnToPoolTask(poolTask.payload.id)),
    ).subscribe({
      next: response => {
        this.isLoading = false;
        this.checkItemStatus();
        this.reload();
      },
      error: error => {
        this.isLoading = false;
        this.checkItemStatus();
        this.reload();
      },
    });
  }

  createbody(): any {
    return {
      [this.option]: 'true',
    };
  }

  reloadObjectExecution(): Observable<RemoteData<DSpaceObject> | DSpaceObject> {
    return this.objectDataService.findByItem(this.itemUuid as string);
  }

  actionExecution(): Observable<any> {
    return this.objectDataService.submitTask(this.object.id, this.createbody());
  }

  initObjects(object: ClaimedTask) {
    this.object = object;
  }

  ngOnInit(): void {
    this.checkItemStatus();
  }

  checkItemStatus(): void {
    this.wfi.item.pipe(
      getFirstSucceededRemoteData(),
      switchMap((item: any) => this.claimedTaskDataService.checkIfClaimedTaskExistForItem(item.payload.id).pipe(
        map((response: RemoteData<ClaimedTask>) => response.hasSucceeded && response.statusCode !== 204),
        catchError(() => of(false)),
      )),
    ).subscribe({
      next: (show: boolean) => {
        this.showButton = show;
      },
      error: error => console.error('Error checking item status', error),
    });
  }

  getPoliciesRoute(item: Item): string[] {
    return ['/items', item.uuid, 'edit', ITEM_EDIT_AUTHORIZATIONS_PATH];
  }

}
