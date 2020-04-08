import { Component, OnInit } from '@angular/core';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { Context } from '../../../../../core/shared/context.model';
import { SearchResultGridElementComponent } from '../../../../../shared/object-grid/search-result-grid-element/search-result-grid-element.component';
import { PoolTaskSearchResult } from '../../../../../shared/object-collection/shared/pool-task-search-result.model';
import { Observable } from 'rxjs';
import { WorkflowItem } from '../../../../../core/submission/models/workflowitem.model';
import { RemoteData } from '../../../../../core/data/remote-data';
import { getAllSucceededRemoteData, getRemoteDataPayload } from '../../../../../core/shared/operators';
import { SearchResult } from '../../../../../shared/search/search-result.model';
import { TaskObject } from '../../../../../core/tasks/models/task-object.model';
import { ClaimedTaskSearchResult } from '../../../../../shared/object-collection/shared/claimed-task-search-result.model';
import { LinkService } from '../../../../../core/cache/builders/link.service';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { followLink } from '../../../../../shared/utils/follow-link-config.model';
import { BitstreamDataService } from '../../../../../core/data/bitstream-data.service';

@listableObjectComponent(PoolTaskSearchResult, ViewMode.GridElement, Context.AdminWorkflowSearch)
@listableObjectComponent(ClaimedTaskSearchResult, ViewMode.GridElement, Context.AdminWorkflowSearch)
@Component({
  selector: 'ds-task-admin-workflow-search-result-grid-element',
  styleUrls: ['./task-admin-workflow-search-result-grid-element.component.scss'],
  templateUrl: './task-admin-workflow-search-result-grid-element.component.html'
})
/**
 * The component for displaying a list element for an task search result on the admin workflow search page
 */
export class TaskAdminWorkflowSearchResultGridElementComponent extends SearchResultGridElementComponent<SearchResult<TaskObject>, TaskObject> implements OnInit {
  /**
   * The workflow item linked to the task object
   */
  public wfi$: Observable<WorkflowItem>;

  constructor(private linkService: LinkService, protected truncatableService: TruncatableService, protected bitstreamService: BitstreamDataService) {
    super(truncatableService, bitstreamService);
  }

  /**
   * Initialize the workflow item
   */
  ngOnInit(): void {
    super.ngOnInit();
    this.dso = this.linkService.resolveLink(this.dso, followLink('workflowitem'));
    this.wfi$ = (this.dso.workflowitem as Observable<RemoteData<WorkflowItem>>).pipe(getAllSucceededRemoteData(), getRemoteDataPayload());
  }
}
