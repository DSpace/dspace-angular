import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { MyDspacePageRoutingModule } from './my-dspace-page-routing.module';
import { MyDSpacePageComponent } from './my-dspace-page.component';
import { MyDSpaceResultsComponent } from './my-dspace-results/my-dspace-results.component';
import { WorkspaceItemSearchResultListElementComponent } from '../shared/object-list/my-dspace-result-list-element/workspace-item-search-result/workspace-item-search-result-list-element.component';
import { ClaimedSearchResultListElementComponent } from '../shared/object-list/my-dspace-result-list-element/claimed-search-result/claimed-search-result-list-element.component';
import { PoolSearchResultListElementComponent } from '../shared/object-list/my-dspace-result-list-element/pool-search-result/pool-search-result-list-element.component';
import { MyDSpaceNewSubmissionComponent } from './my-dspace-new-submission/my-dspace-new-submission.component';
import { ItemSearchResultDetailElementComponent } from '../shared/object-detail/my-dspace-result-detail-element/item-search-result/item-search-result-detail-element.component';
import { WorkspaceItemSearchResultDetailElementComponent } from '../shared/object-detail/my-dspace-result-detail-element/workspace-item-search-result/workspace-item-search-result-detail-element.component';
import { WorkflowItemSearchResultDetailElementComponent } from '../shared/object-detail/my-dspace-result-detail-element/workflow-item-search-result/workflow-item-search-result-detail-element.component';
import { ClaimedTaskSearchResultDetailElementComponent } from '../shared/object-detail/my-dspace-result-detail-element/claimed-task-search-result/claimed-task-search-result-detail-element.component';
import { MyDSpaceGuard } from './my-dspace.guard';
import { MyDSpaceConfigurationService } from './my-dspace-configuration.service';
import { SearchResultListElementComponent } from '../shared/object-list/search-result-list-element/search-result-list-element.component';
import { ItemSearchResultListElementSubmissionComponent } from '../shared/object-list/my-dspace-result-list-element/item-search-result/item-search-result-list-element-submission.component';
import { WorkflowItemSearchResultListElementComponent } from '../shared/object-list/my-dspace-result-list-element/workflow-item-search-result/workflow-item-search-result-list-element.component';
import { PoolSearchResultDetailElementComponent } from '../shared/object-detail/my-dspace-result-detail-element/pool-search-result/pool-search-result-detail-element.component';
import { CollectionSelectorComponent } from './collection-selector/collection-selector.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MyDspacePageRoutingModule,
  ],
  declarations: [
    MyDSpacePageComponent,
    MyDSpaceResultsComponent,
    WorkspaceItemSearchResultListElementComponent,
    WorkflowItemSearchResultListElementComponent,
    ClaimedSearchResultListElementComponent,
    PoolSearchResultListElementComponent,
    ItemSearchResultDetailElementComponent,
    WorkspaceItemSearchResultDetailElementComponent,
    WorkflowItemSearchResultDetailElementComponent,
    ClaimedTaskSearchResultDetailElementComponent,
    PoolSearchResultDetailElementComponent,
    MyDSpaceNewSubmissionComponent,
    ItemSearchResultListElementSubmissionComponent,
    CollectionSelectorComponent
  ],
  providers: [
    MyDSpaceGuard,
    MyDSpaceConfigurationService
  ],
  entryComponents: [
    SearchResultListElementComponent,
    WorkspaceItemSearchResultListElementComponent,
    WorkflowItemSearchResultListElementComponent,
    ClaimedSearchResultListElementComponent,
    PoolSearchResultListElementComponent,
    ItemSearchResultDetailElementComponent,
    WorkspaceItemSearchResultDetailElementComponent,
    WorkflowItemSearchResultDetailElementComponent,
    ClaimedTaskSearchResultDetailElementComponent,
    PoolSearchResultDetailElementComponent,
    ItemSearchResultListElementSubmissionComponent,
    CollectionSelectorComponent
  ]
})

/**
 * This module handles all components that are necessary for the mydspace page
 */
export class MyDSpacePageModule {

}
