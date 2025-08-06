import { AsyncPipe } from '@angular/common';
import {
  Component,
  Injector,
  Input,
  OnInit,
} from '@angular/core';
import {
  Router,
  RouterLink,
} from '@angular/router';
import { RemoteData } from '@dspace/core/data/remote-data';
import { RequestService } from '@dspace/core/data/request.service';
import { WorkflowActionDataService } from '@dspace/core/data/workflow-action-data.service';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { Item } from '@dspace/core/shared/item.model';
import { WorkflowItem } from '@dspace/core/submission/models/workflowitem.model';
import { ClaimedTaskDataService } from '@dspace/core/tasks/claimed-task-data.service';
import { ClaimedTask } from '@dspace/core/tasks/models/claimed-task-object.model';
import { WorkflowAction } from '@dspace/core/tasks/models/workflow-action-object.model';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { getWorkflowItemViewRoute } from '../../../workflowitems-edit-page/workflowitems-edit-page-routing-paths';
import { SearchService } from '../../search/search.service';
import { VarDirective } from '../../utils/var.directive';
import { MyDSpaceActionsComponent } from '../mydspace-actions';
import { ClaimedTaskActionsLoaderComponent } from './switcher/claimed-task-actions-loader.component';

/**
 * This component represents actions related to ClaimedTask object.
 */
@Component({
  selector: 'ds-claimed-task-actions',
  styleUrls: ['./claimed-task-actions.component.scss'],
  templateUrl: './claimed-task-actions.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    ClaimedTaskActionsLoaderComponent,
    NgbTooltipModule,
    RouterLink,
    TranslateModule,
    VarDirective,
  ],
})
export class ClaimedTaskActionsComponent extends MyDSpaceActionsComponent<ClaimedTask, ClaimedTaskDataService> implements OnInit {

  /**
   * The ClaimedTask object
   */
  @Input() object: ClaimedTask;

  /**
   * The item object that belonging to the ClaimedTask object
   */
  @Input() item: Item;

  /**
   * The workflowitem object that belonging to the ClaimedTask object
   */
  @Input() workflowitem: WorkflowItem;

  /**
   * The workflow action available for this task
   */
  public actionRD$: Observable<RemoteData<WorkflowAction>>;

  /**
   * Initialize instance variables
   *
   * @param {Injector} injector
   * @param {Router} router
   * @param {NotificationsService} notificationsService
   * @param {TranslateService} translate
   * @param {SearchService} searchService
   * @param {RequestService} requestService
   * @param workflowActionService
   */
  constructor(protected injector: Injector,
    protected router: Router,
    protected notificationsService: NotificationsService,
    protected translate: TranslateService,
    protected searchService: SearchService,
    protected requestService: RequestService,
    protected workflowActionService: WorkflowActionDataService,
  ) {
    super(ClaimedTask.type, injector, router, notificationsService, translate, searchService, requestService);
  }

  /**
   * Initialize objects
   */
  ngOnInit() {
    this.initObjects(this.object);
    this.initAction(this.object);
  }

  /**
   * Init the ClaimedTask and WorkflowItem objects
   *
   * @param {PoolTask} object
   */
  initObjects(object: ClaimedTask) {
    this.object = object;
  }

  /**
   * Init the WorkflowAction
   *
   * @param object
   */
  initAction(object: ClaimedTask) {
    this.actionRD$ = object.action;
  }

  /**
   * Get the workflowitem view route.
   */
  getWorkflowItemViewRoute(workflowitem: WorkflowItem): string {
    return getWorkflowItemViewRoute(workflowitem?.id);
  }

}
