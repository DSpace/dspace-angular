import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { MyDspacePageRoutingModule } from './my-dspace-page-routing.module';
import { WorkspaceItemSearchResultListElementComponent } from '../shared/object-list/my-dspace-result-list-element/workspace-item-search-result/workspace-item-search-result-list-element.component';
import { ClaimedSearchResultListElementComponent } from '../shared/object-list/my-dspace-result-list-element/claimed-search-result/claimed-search-result-list-element.component';
import { PoolSearchResultListElementComponent } from '../shared/object-list/my-dspace-result-list-element/pool-search-result/pool-search-result-list-element.component';
import { ItemSearchResultDetailElementComponent } from '../shared/object-detail/my-dspace-result-detail-element/item-search-result/item-search-result-detail-element.component';
import { WorkspaceItemSearchResultDetailElementComponent } from '../shared/object-detail/my-dspace-result-detail-element/workspace-item-search-result/workspace-item-search-result-detail-element.component';
import { WorkflowItemSearchResultDetailElementComponent } from '../shared/object-detail/my-dspace-result-detail-element/workflow-item-search-result/workflow-item-search-result-detail-element.component';
import { ClaimedTaskSearchResultDetailElementComponent } from '../shared/object-detail/my-dspace-result-detail-element/claimed-task-search-result/claimed-task-search-result-detail-element.component';
import { ItemSearchResultListElementSubmissionComponent } from '../shared/object-list/my-dspace-result-list-element/item-search-result/item-search-result-list-element-submission.component';
import { WorkflowItemSearchResultListElementComponent } from '../shared/object-list/my-dspace-result-list-element/workflow-item-search-result/workflow-item-search-result-list-element.component';
import { PoolSearchResultDetailElementComponent } from '../shared/object-detail/my-dspace-result-detail-element/pool-search-result/pool-search-result-detail-element.component';
import { ClaimedApprovedSearchResultListElementComponent } from '../shared/object-list/my-dspace-result-list-element/claimed-search-result/claimed-approved-search-result/claimed-approved-search-result-list-element.component';
import { ClaimedDeclinedSearchResultListElementComponent } from '../shared/object-list/my-dspace-result-list-element/claimed-search-result/claimed-declined-search-result/claimed-declined-search-result-list-element.component';
import { ResearchEntitiesModule } from '../entity-groups/research-entities/research-entities.module';

const ENTRY_COMPONENTS = [
  // put only entry components that use custom decorator
  WorkspaceItemSearchResultListElementComponent,
  WorkflowItemSearchResultListElementComponent,
  ClaimedSearchResultListElementComponent,
  ClaimedApprovedSearchResultListElementComponent,
  ClaimedDeclinedSearchResultListElementComponent,
  PoolSearchResultListElementComponent,
  ItemSearchResultDetailElementComponent,
  WorkspaceItemSearchResultDetailElementComponent,
  WorkflowItemSearchResultDetailElementComponent,
  ClaimedTaskSearchResultDetailElementComponent,
  PoolSearchResultDetailElementComponent,
  ItemSearchResultListElementSubmissionComponent
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MyDspacePageRoutingModule,
    ResearchEntitiesModule.withEntryComponents()
  ],
  declarations: [
    ...ENTRY_COMPONENTS
  ]
})

/**
 * This module handles all components that are necessary for the mydspace page
 */
export class MyDspaceSearchModule {
  /**
   * NOTE: this method allows to resolve issue with components that using a custom decorator
   * which are not loaded during SSR otherwise
   */
  static withEntryComponents() {
    return {
      ngModule: MyDspaceSearchModule,
      providers: ENTRY_COMPONENTS.map((component) => ({provide: component}))
    };
  }
}
