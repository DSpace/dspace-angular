import { Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { hasValue } from '../../../shared/empty.util';
import { distinctUntilChanged, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { PoolTaskSearchResult } from '../../../shared/object-collection/shared/pool-task-search-result.model';
import { SelectableListService } from '../../../shared/object-list/selectable-list/selectable-list.service';
import { PoolTaskDataService } from '../../../core/tasks/pool-task-data.service';
import { ClaimedTaskDataService } from '../../../core/tasks/claimed-task-data.service';
import { ProcessTaskResponse } from '../../../core/tasks/models/process-task-response';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { NotificationOptions } from '../../../shared/notifications/models/notification-options.model';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { SearchService } from '../../../core/shared/search/search.service';
import { RequestService } from '../../../core/data/request.service';
import { ClaimedTaskSearchResult } from '../../../shared/object-collection/shared/claimed-task-search-result.model';
import {
  WORKFLOW_TASK_OPTION_APPROVE
} from '../../../shared/mydspace-actions/claimed-task/approve/claimed-task-actions-approve.component';
import {
  WORKFLOW_TASK_OPTION_REJECT
} from '../../../shared/mydspace-actions/claimed-task/reject/claimed-task-actions-reject.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';




/**
 * This component offers the option to perform bulk action on workflow items
 */
@Component({
  selector: 'ds-my-dspace-bulk-action',
  templateUrl: './my-dspace-bulk-action.component.html'
})
export class MyDSpaceBulkActionComponent  implements OnInit, OnDestroy{
  /**
   * The id for the selectable list
   */
  @Input()
  listId: string;
  /**
   * Loading state
   */
  processing$: EventEmitter<boolean> = new EventEmitter<boolean>();
  /**
   * Check if claim button is enabled
   */
  claimEnabled$: Observable<boolean>;
  /**
   * Check if claimed task buttons is enabled
   */
  claimedTaskActionsEnabled$: Observable<boolean>;
  /**
   * Reference to NgbModal
   */
  public modalRef: NgbModalRef;
  /**
   * The reject form group
   */
  public rejectForm: UntypedFormGroup;
  /**
   * The number of successful actions
   * @private
   */
  private successfulItems = 0;
  /**
   * The number of erroneous actions
   * @private
   */
  private errorItems = 0;
  /**
   * Set of subscription to unsubscribe on destroy
   * @private
   */
  private subs: Subscription[] = [];
  /**
   * Options for body requests
   * @private
   */
  private readonly approveOption = WORKFLOW_TASK_OPTION_APPROVE;
  private readonly rejectOption = WORKFLOW_TASK_OPTION_REJECT;

  constructor(
    protected selectableListService: SelectableListService,
    protected poolTaskDataService: PoolTaskDataService,
    protected claimedTaskService: ClaimedTaskDataService,
    protected notificationsService: NotificationsService,
    protected translate: TranslateService,
    protected router: Router,
    protected searchService: SearchService,
    protected requestService: RequestService,
    protected modalService: NgbModal,
    protected formBuilder: UntypedFormBuilder,
  ) { }

  /**
   * Init reject form and button disabling checks
   */
  ngOnInit() {
    this.rejectForm = this.formBuilder.group({
      reason: ['', Validators.required]
    });
    this.claimEnabled$ = this.getActionEnabled('claimaction');
    this.claimedTaskActionsEnabled$ = this.getActionEnabled('claimedtask');
  }

  /**
   * Unsubscribe from active subscriptions
   */
  ngOnDestroy() {
    if (hasValue(this.subs)) {
      this.subs.forEach(sub => sub.unsubscribe());
    }
  }

  /**
   * Trigger a claim action for each selected item
   */
  claimAllSelectedTask() {
    this.processing$.next(true);

    this.subs.push(
      this.getSelectedList().pipe(
        take(1),
        map(list => list.map(item =>
            this.poolTaskDataService.getPoolTaskEndpointById(item.indexableObject.id)
          )
        ),
        switchMap(endPoints => combineLatest(...endPoints)),
        map(tasksHref => tasksHref.filter(data => hasValue(data))
          .map(href => this.claimItemByHref(href))
        ),
        switchMap(claims => combineLatest(...claims))
      ).subscribe(() => {
          this.handlePageReload();
      })
    );
  }

  /**
   * Return selected objects
   */
  getSelectedList(): Observable<PoolTaskSearchResult[] | ClaimedTaskSearchResult[]> {
    return this.selectableListService.getSelectableList(this.listId).pipe(
      filter(data => !!data),
      distinctUntilChanged(),
      map(task => task.selection as (PoolTaskSearchResult[] | ClaimedTaskSearchResult[])),
    );
  }

  /**
   * Check if action is enabled based on action type
   * @param actionType
   */
  getActionEnabled(actionType: string): Observable<boolean> {
    return this.getSelectedList().pipe(
      map(list => list.map(
          item => (item._embedded.indexableObject.action || item._embedded.indexableObject.type) as any as string
        ).some(
          action => action === actionType
        )
      ),
    );
  }

  /**
   * Claim single item based on claim href
   * @param href
   */
  claimItemByHref(href: string): Observable<ProcessTaskResponse> {
    const id = href.substring(href.lastIndexOf('/') + 1, href.length);
    return this.getSelectedList().pipe(
      take(1),
      map(list => list.find(item => item.indexableObject.id.toString() === id)),
      switchMap(item => this.claimedTaskService.claimTask(item.indexableObject.id, href)),
      map((response) => this.handleResponseStatus(response))
    );
  }

  /**
   * Submit request to approve or reject an item
   *
   * @param id
   * @param options
   */
  submitItem(id: string, options): Observable<ProcessTaskResponse> {
    return this.claimedTaskService.submitTask(id, options).pipe(
      take(1),
      map((response) => this.handleResponseStatus(response))
    );
  }

  /**
   * Notify status on operation completion
   *
   * @param succeeded
   * @param itemNumber
   */
  notifyOperationStatus(succeeded: boolean, itemNumber: number) {
    if (succeeded) {
      this.notificationsService.success(null,
        this.translate.get('submission.workflow.tasks.bulk.item.success', {itemNumber}),
        new NotificationOptions(5000, false)
      );
    } else {
      this.notificationsService.error(null,
        this.translate.get('submission.workflow.tasks.bulk.item.error', {itemNumber}),
        new NotificationOptions(20000, true));
    }
  }

  /**
   * Reload page to get latest status of items
   */
  reload(): void {
    this.router.navigated = false;
    const url = decodeURIComponent(this.router.url);
    // override the route reuse strategy
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
    // This assures that the search cache is empty before reloading mydspace.
    // See https://github.com/DSpace/dspace-angular/pull/468
    this.searchService.getEndpoint().pipe(
      take(1),
      tap((cachedHref: string) => this.requestService.removeByHrefSubstring(cachedHref))
    ).subscribe(() => this.router.navigateByUrl(url));
  }

  /**
   * Handle page reload and notification at the end of any operation
   */
  handlePageReload(): void {
    this.processing$.next(false);

    if ( this.successfulItems > 0) {
      this.notifyOperationStatus(true, this.successfulItems);
    }
    if (this.errorItems > 0) {
      this.notifyOperationStatus(false, this.errorItems);
    }
    this.successfulItems = 0;
    this.errorItems = 0;
    this.selectableListService.deselectAll(this.listId);
    this.reload();
  }

  /**
   * Trigger an approval action for each selected item
   */
  submitAllSelectedTask() {
    this.processing$.next(true);

    this.subs.push(
      this.getSelectedList().pipe(
        take(1),
        map(list => list.map(
          item => this.submitItem(item.indexableObject.id, this.createBody(this.approveOption)))
        ),
        switchMap(submissions => combineLatest(...submissions))
      ).subscribe(() => {
        this.handlePageReload();
      })
    );
  }

  /**
   * Trigger a reject action for each selected item
   */
  rejectSelected() {
    this.processing$.next(true);

    this.modalRef.close('Send Button');
    const reason = this.rejectForm.get('reason').value;
    const body = Object.assign(this.createBody(this.rejectOption), { reason });

    this.subs.push(
      this.getSelectedList().pipe(
        take(1),
        map(list => list.map(
          item => this.submitItem(item.indexableObject.id, body))
        ),
        switchMap(submissions => combineLatest(...submissions))
      ).subscribe(() => {
        this.handlePageReload();
      })
    );
  }

  /**
   * Open modal
   * @param content
   */
  openRejectModal(content: any) {
    this.rejectForm.reset();
    this.modalRef = this.modalService.open(content);
  }

  /**
   * Create a request body for submitting the task
   * Overwrite this method in the child component if the body requires more than just the option
   */
  createBody(option: string): any {
    return {
      [option]: 'true'
    };
  }

  /**
   * Trigger a return pool action for each selected item
   */
  returnSelectedToPool(): void {
    this.processing$.next(true);

    this.subs.push(
      this.getSelectedList().pipe(
        take(1),
        map(list => list.map(
            item => this.claimedTaskService.returnToPoolTask(item.indexableObject.id).pipe(
              map((response) => this.handleResponseStatus(response))
            )
          )
        ),
        switchMap(submissions => combineLatest(...submissions))
      ).subscribe(() => {
        this.handlePageReload();
      })
    );
  }

  /**
   * Handle status of response for notification
   * @param response
   * @private
   */
  private handleResponseStatus(response: ProcessTaskResponse): ProcessTaskResponse {
    if (response.hasSucceeded) {
      this.successfulItems += 1;
    } else {
      this.errorItems += 1;
    }
    return response;
  }
}
