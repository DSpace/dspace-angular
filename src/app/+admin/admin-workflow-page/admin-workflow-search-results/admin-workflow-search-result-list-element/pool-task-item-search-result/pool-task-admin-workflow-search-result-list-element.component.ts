import { Component } from '@angular/core';
import { ViewMode } from '../../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../../shared/object-collection/shared/listable-object/listable-object.decorator';
import { Context } from '../../../../../core/shared/context.model';
import { SearchResultListElementComponent } from '../../../../../shared/object-list/search-result-list-element/search-result-list-element.component';
import { PoolTaskSearchResult } from '../../../../../shared/object-collection/shared/pool-task-search-result.model';
import { PoolTask } from '../../../../../core/tasks/models/pool-task-object.model';
import { Observable, pipe } from 'rxjs';
import { RemoteData } from '../../../../../core/data/remote-data';
import { WorkflowItem } from '../../../../../core/submission/models/workflowitem.model';
import { getAllSucceededRemoteData, getRemoteDataPayload } from '../../../../../core/shared/operators';

@listableObjectComponent(PoolTaskSearchResult, ViewMode.ListElement, Context.AdminWorkflowSearch)
@Component({
  selector: 'ds-pooltask-admin-workflow-search-result-list-element',
  styleUrls: ['./pool-task-admin-workflow-search-result-list-element.component.scss'],
  templateUrl: './pool-task-admin-workflow-search-result-list-element.component.html'
})
/**
 * The component for displaying a list element for an pool task search result on the admin search page
 */
export class PoolTaskAdminWorkflowSearchResultListElementComponent extends SearchResultListElementComponent<PoolTaskSearchResult, PoolTask> {
  public wfi$: Observable<WorkflowItem>;

  ngOnInit(): void {
    super.ngOnInit();
    this.wfi$ = (this.dso.workflowitem as Observable<RemoteData<WorkflowItem>>).pipe(getAllSucceededRemoteData(), getRemoteDataPayload());
  }
}
