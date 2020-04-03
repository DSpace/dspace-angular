import { Component } from '@angular/core';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { Context } from '../../../../../core/shared/context.model';
import { SearchResultListElementComponent } from '../../../../../shared/object-list/search-result-list-element/search-result-list-element.component';
import { PoolTaskSearchResult } from '../../../../../shared/object-collection/shared/pool-task-search-result.model';
import { Observable, pipe } from 'rxjs';
import { RemoteData } from '../../../../../core/data/remote-data';
import { WorkflowItem } from '../../../../../core/submission/models/workflowitem.model';
import { getAllSucceededRemoteData, getRemoteDataPayload } from '../../../../../core/shared/operators';
import { ClaimedTaskSearchResult } from '../../../../../shared/object-collection/shared/claimed-task-search-result.model';
import { TaskObject } from '../../../../../core/tasks/models/task-object.model';
import { SearchResult } from '../../../../../shared/search/search-result.model';
import { followLink } from '../../../../../shared/utils/follow-link-config.model';
import { LinkService } from '../../../../../core/cache/builders/link.service';
import { TruncatableService } from '../../../../../shared/truncatable/truncatable.service';
import { tap } from 'rxjs/operators';

@listableObjectComponent(PoolTaskSearchResult, ViewMode.ListElement, Context.AdminWorkflowSearch)
@listableObjectComponent(ClaimedTaskSearchResult, ViewMode.ListElement, Context.AdminWorkflowSearch)
@Component({
  selector: 'ds-pooltask-admin-workflow-search-result-list-element',
  styleUrls: ['./pool-task-admin-workflow-search-result-list-element.component.scss'],
  templateUrl: './pool-task-admin-workflow-search-result-list-element.component.html'
})
/**
 * The component for displaying a list element for an pool task search result on the admin search page
 */
export class PoolTaskAdminWorkflowSearchResultListElementComponent extends SearchResultListElementComponent<SearchResult<TaskObject>, TaskObject> {
  public wfi$: Observable<WorkflowItem>;

  constructor(private linkService: LinkService, protected truncatableService: TruncatableService) {
    super(truncatableService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.dso = this.linkService.resolveLink(this.dso, followLink('workflowitem'));
    this.wfi$ = (this.dso.workflowitem as Observable<RemoteData<WorkflowItem>>).pipe(getAllSucceededRemoteData(), getRemoteDataPayload());
  }
}
