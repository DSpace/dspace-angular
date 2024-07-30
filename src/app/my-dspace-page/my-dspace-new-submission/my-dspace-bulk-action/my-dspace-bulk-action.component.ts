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


/**
 * This gives the option to perform bulk action on workflow items
 */
@Component({
  selector: 'ds-my-dspace-bulk-action',
  templateUrl: './my-dspace-bulk-action.component.html'
})
export class MyDSpaceBulkActionComponent  implements OnInit, OnDestroy{

  @Input()
  listId: string;

  processing$: EventEmitter<boolean> = new EventEmitter<boolean>();

  claimEnabled$: Observable<boolean>;
  claimedTaskActionsEnabled$: Observable<boolean>;

  private successfullItems = 0;
  private errorItems = 0;
  private subs: Subscription[] = [];

  private readonly approveOption = WORKFLOW_TASK_OPTION_APPROVE;

  constructor(
    protected selectableListService: SelectableListService,
    protected poolTaskDataService: PoolTaskDataService,
    protected claimedTaskService: ClaimedTaskDataService,
    protected notificationsService: NotificationsService,
    protected translate: TranslateService,
    protected router: Router,
    protected searchService: SearchService,
    protected requestService: RequestService,
  ) { }

  ngOnInit() {
    this.claimEnabled$ = this.getActionEnabled('claimaction');
    this.claimedTaskActionsEnabled$ = this.getActionEnabled('claimedtask');
    this.getSelectedList().subscribe(console.log);
  }

  ngOnDestroy() {
    if (hasValue(this.subs)) {
      this.subs.forEach(sub => sub.unsubscribe());
    }
  }

  claimAllSelectedTask() {
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

  getSelectedList(): Observable<PoolTaskSearchResult[] | ClaimedTaskSearchResult[]> {
    return this.selectableListService.getSelectableList(this.listId).pipe(
      filter(data => !!data),
      distinctUntilChanged(),
      map(task => task.selection as (PoolTaskSearchResult[] | ClaimedTaskSearchResult[])),
    );
  }

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

  claimItemByHref(href: string): Observable<ProcessTaskResponse> {
    const id = href.substring(href.lastIndexOf('/') + 1, href.length);
    return this.getSelectedList().pipe(
      take(1),
      map(list => list.find(item => item.indexableObject.id.toString() === id)),
      switchMap(item => this.claimedTaskService.claimTask(item.indexableObject.id, href)),
      map((response) => {
        if (response.hasSucceeded) {
          this.successfullItems += 1;
        } else {
          this.errorItems += 1;
        }

        return response;
      })
    );
  }


  approveItem(id: string, options): Observable<ProcessTaskResponse> {
    return this.claimedTaskService.submitTask(id, options).pipe(
      take(1),
      map((response) => {
        if (response.hasSucceeded) {
          this.successfullItems += 1;
        } else {
          this.errorItems += 1;
        }

        return response;
      })
    );
  }

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

  handlePageReload(): void {
    if ( this.successfullItems > 0) {
      this.notifyOperationStatus(true, this.successfullItems);
    }
    if (this.errorItems > 0) {
      this.notifyOperationStatus(false, this.errorItems);
    }
    this.successfullItems = 0;
    this.errorItems = 0;
    this.selectableListService.deselectAll(this.listId);
    this.reload();
  }

  submitAllSelectedTask() {
    this.subs.push(
      this.getSelectedList().pipe(
        take(1),
        map(list => list.map(item => this.approveItem(item.indexableObject.id, {
            [this.approveOption]: 'true'
          }))
        ),
        switchMap(submissions => combineLatest(...submissions))
      ).subscribe(() => {
        this.handlePageReload();
      })
    );
  }
}
