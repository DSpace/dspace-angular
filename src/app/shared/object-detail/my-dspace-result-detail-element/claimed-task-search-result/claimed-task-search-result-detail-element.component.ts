import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  ClaimedTask,
  ClaimedTaskSearchResult,
  Context,
  DSONameService,
  followLink,
  getFirstCompletedRemoteData,
  Item,
  LinkService,
  ObjectCacheService,
  RemoteData,
  ViewMode,
  WorkflowItem,
} from '@dspace/core';
import {
  hasValue,
  isNotEmpty,
} from '@dspace/shared/utils';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
} from 'rxjs';
import {
  mergeMap,
  tap,
} from 'rxjs/operators';

import { ClaimedTaskActionsComponent } from '../../../mydspace-actions/claimed-task/claimed-task-actions.component';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { ItemDetailPreviewComponent } from '../item-detail-preview/item-detail-preview.component';
import { SearchResultDetailElementComponent } from '../search-result-detail-element.component';

/**
 * This component renders claimed task object for the search result in the detail view.
 */
@Component({
  selector: 'ds-claimed-task-search-result-detail-element',
  styleUrls: ['../search-result-detail-element.component.scss'],
  templateUrl: './claimed-task-search-result-detail-element.component.html',
  standalone: true,
  imports: [ItemDetailPreviewComponent, ClaimedTaskActionsComponent, AsyncPipe],
})

@listableObjectComponent(ClaimedTaskSearchResult, ViewMode.DetailedListElement)
export class ClaimedTaskSearchResultDetailElementComponent extends SearchResultDetailElementComponent<ClaimedTaskSearchResult, ClaimedTask> implements OnInit, OnDestroy  {

  /**
   * The item object that belonging to the result object
   */
  public item$: BehaviorSubject<Item> = new BehaviorSubject<Item>(null);

  /**
   * A boolean representing if to show submitter information
   */
  public showSubmitter = true;

  /**
   * Represents the badge context
   */
  public badgeContext = Context.MyDSpaceValidation;

  /**
   * The workflowitem object that belonging to the result object
   */
  public workflowitem$: BehaviorSubject<WorkflowItem> = new BehaviorSubject<WorkflowItem>(null);

  constructor(
    public dsoNameService: DSONameService,
    protected linkService: LinkService,
    protected objectCache: ObjectCacheService,
  ) {
    super(dsoNameService);
  }

  /**
   * Initialize all instance variables
   */
  ngOnInit() {
    super.ngOnInit();
    this.linkService.resolveLinks(this.dso, followLink('workflowitem', {},
      followLink('item', {}, followLink('bundles')),
      followLink('submitter'),
    ), followLink('action'));

    (this.dso.workflowitem as Observable<RemoteData<WorkflowItem>>).pipe(
      getFirstCompletedRemoteData(),
      mergeMap((wfiRD: RemoteData<WorkflowItem>) => {
        if (wfiRD.hasSucceeded) {
          this.workflowitem$.next(wfiRD.payload);
          return (wfiRD.payload.item as Observable<RemoteData<Item>>).pipe(
            getFirstCompletedRemoteData(),
          );
        } else {
          return EMPTY;
        }
      }),
      tap((itemRD: RemoteData<Item>) => {
        if (isNotEmpty(itemRD) && itemRD.hasSucceeded) {
          this.item$.next(itemRD.payload);
        }
      }),
    ).subscribe();
  }

  ngOnDestroy() {
    // This ensures the object is removed from cache, when action is performed on task
    if (hasValue(this.dso)) {
      this.objectCache.remove(this.dso._links.workflowitem.href);
    }
  }

}
