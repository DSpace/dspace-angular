import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { MyDspacePageRoutingModule } from './my-dspace-page-routing.module';
import { MyDSpacePageComponent } from './my-dspace-page.component';
import { SearchPageModule } from '../+search-page/search-page.module';
import { MyDSpaceResultsComponent } from './my-dspace-results/my-dspace-results.component';
import { WorkspaceitemMyDSpaceResultListElementComponent } from '../shared/object-list/my-dspace-result-list-element/workspaceitem-my-dspace-result/workspaceitem-my-dspace-result-list-element.component';
import { ItemMyDSpaceResultListElementComponent } from '../shared/object-list/my-dspace-result-list-element/item-my-dspace-result/item-my-dspace-result-list-element.component';
import { WorkflowitemMyDSpaceResultListElementComponent } from '../shared/object-list/my-dspace-result-list-element/workflowitem-my-dspace-result/workflowitem-my-dspace-result-list-element.component';
import { ClaimedMyDSpaceResultListElementComponent } from '../shared/object-list/my-dspace-result-list-element/claimed-my-dspace-result/claimed-my-dspace-result-list-element.component';
import { PoolMyDSpaceResultListElementComponent } from '../shared/object-list/my-dspace-result-list-element/pool-my-dspace-result/pool-my-dspace-result-list-element.component';
import { MyDSpaceNewSubmissionComponent } from './my-dspace-new-submission/my-dspace-new-submission.component';
import { ItemMyDSpaceResultDetailElementComponent } from '../shared/object-detail/my-dspace-result-detail-element/item-my-dspace-result/item-my-dspace-result-detail-element.component';
import { WorkspaceitemMyDSpaceResultDetailElementComponent } from '../shared/object-detail/my-dspace-result-detail-element/workspaceitem-my-dspace-result/workspaceitem-my-dspace-result-detail-element.component';
import { WorkflowitemMyDSpaceResultDetailElementComponent } from '../shared/object-detail/my-dspace-result-detail-element/workflowitem-my-dspace-result/workflowitem-my-dspace-result-detail-element.component';
import { ClaimedMyDSpaceResultDetailElementComponent } from '../shared/object-detail/my-dspace-result-detail-element/claimed-my-dspace-result/claimed-my-dspace-result-detail-element.component';
import { PoolMyDSpaceResultDetailElementComponent } from '../shared/object-detail/my-dspace-result-detail-element/pool-my-dspace-result/pool-my-dspace-result-detail-lement.component';
import { MyDSpaceGuard } from './my-dspace.guard';
import { MyDSpaceConfigurationService } from './my-dspace-configuration.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MyDspacePageRoutingModule,
    SearchPageModule
  ],
  declarations: [
    MyDSpacePageComponent,
    MyDSpaceResultsComponent,
    ItemMyDSpaceResultListElementComponent,
    WorkspaceitemMyDSpaceResultListElementComponent,
    WorkflowitemMyDSpaceResultListElementComponent,
    ClaimedMyDSpaceResultListElementComponent,
    PoolMyDSpaceResultListElementComponent,
    ItemMyDSpaceResultDetailElementComponent,
    WorkspaceitemMyDSpaceResultDetailElementComponent,
    WorkflowitemMyDSpaceResultDetailElementComponent,
    ClaimedMyDSpaceResultDetailElementComponent,
    PoolMyDSpaceResultDetailElementComponent,
    MyDSpaceNewSubmissionComponent
  ],
  providers: [
    MyDSpaceGuard,
    MyDSpaceConfigurationService
  ],
  entryComponents: [
    ItemMyDSpaceResultListElementComponent,
    WorkspaceitemMyDSpaceResultListElementComponent,
    WorkflowitemMyDSpaceResultListElementComponent,
    ClaimedMyDSpaceResultListElementComponent,
    PoolMyDSpaceResultListElementComponent,
    ItemMyDSpaceResultDetailElementComponent,
    WorkspaceitemMyDSpaceResultDetailElementComponent,
    WorkflowitemMyDSpaceResultDetailElementComponent,
    ClaimedMyDSpaceResultDetailElementComponent,
    PoolMyDSpaceResultDetailElementComponent
  ]
})

/**
 * This module handles all components that are necessary for the mydspace page
 */
export class MyDSpacePageModule {

}
