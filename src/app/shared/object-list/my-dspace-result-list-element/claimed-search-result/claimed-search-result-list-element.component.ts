import { Component, Inject, OnDestroy, OnInit } from '@angular/core';

import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { ClaimedTaskSearchResult } from '../../../object-collection/shared/claimed-task-search-result.model';
import { LinkService } from '../../../../core/cache/builders/link.service';
import { TruncatableService } from '../../../truncatable/truncatable.service';
import {
  MyDspaceItemStatusType
} from '../../../object-collection/shared/mydspace-item-status/my-dspace-item-status-type';
import { BehaviorSubject, Observable } from 'rxjs';
import { RemoteData } from '../../../../core/data/remote-data';
import { WorkflowItem } from '../../../../core/submission/models/workflowitem.model';
import { followLink } from '../../../utils/follow-link-config.model';
import {
  SearchResultListElementComponent
} from '../../search-result-list-element/search-result-list-element.component';
import { ClaimedTask } from '../../../../core/tasks/models/claimed-task-object.model';
import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { APP_CONFIG, AppConfig } from '../../../../../config/app-config.interface';
import { ObjectCacheService } from '../../../../core/cache/object-cache.service';
import { getFirstCompletedRemoteData } from '../../../../core/shared/operators';

@Component({
  selector: 'ds-claimed-search-result-list-element',
  styleUrls: ['../../search-result-list-element/search-result-list-element.component.scss'],
  templateUrl: './claimed-search-result-list-element.component.html'
})
@listableObjectComponent(ClaimedTaskSearchResult, ViewMode.ListElement)
export class ClaimedSearchResultListElementComponent extends SearchResultListElementComponent<ClaimedTaskSearchResult, ClaimedTask> implements OnInit, OnDestroy {

  /**
   * A boolean representing if to show submitter information
   */
  public showSubmitter = true;

  /**
   * Represent item's status
   */
  public status = MyDspaceItemStatusType.VALIDATION;

  /**
   * The workflowitem object that belonging to the result object
   */
  public workflowitem$: BehaviorSubject<WorkflowItem> = new BehaviorSubject<WorkflowItem>(null);

  /**
   * Display thumbnails if required by configuration
   */
  showThumbnails: boolean;

  public constructor(
    protected linkService: LinkService,
    protected truncatableService: TruncatableService,
    protected dsoNameService: DSONameService,
    protected objectCache: ObjectCacheService,
    @Inject(APP_CONFIG) protected appConfig: AppConfig
  ) {
    super(truncatableService, dsoNameService, appConfig);
  }

  /**
   * Initialize all instance variables
   */
  ngOnInit() {
    super.ngOnInit();
    this.linkService.resolveLinks(this.dso, followLink('workflowitem', {},
      followLink('item'), followLink('submitter')
    ), followLink('action'));
    (this.dso.workflowitem as Observable<RemoteData<WorkflowItem>>).pipe(
      getFirstCompletedRemoteData()
    ).subscribe((wfiRD: RemoteData<WorkflowItem>) => {
      if (wfiRD.hasSucceeded) {
        this.workflowitem$.next(wfiRD.payload);
      }
    });
    this.showThumbnails = this.appConfig.browseBy.showThumbnails;
  }

  ngOnDestroy() {
    // This ensures the object is removed from cache, when action is performed on task
    this.objectCache.remove(this.dso._links.workflowitem.href);
  }

}
