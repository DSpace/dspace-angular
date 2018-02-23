import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { MyDspacePageRoutingModule } from './my-dspace-page-routing.module';
import { MyDSpacePageComponent } from './my-dspace-page.component';
import { SearchPageModule } from '../+search-page/search-page.module';
import { MyDSpaceResultsComponent } from './my-dspace-results/my-dspace-results.component';
import { MyDspaceService } from './my-dspace-service/my-dspace.service';
import { WorkspaceitemMyDSpaceResultListElementComponent } from '../shared/object-list/my-dspace-result-list-element/wsi-my-dspace-result/wsi-my-dspace-result-list-element.component';
import { ItemMyDSpaceResultListElementComponent } from '../shared/object-list/my-dspace-result-list-element/item-my-dspace-result/item-my-dspace-result-list-element.component';
import { WorkflowitemMyDSpaceResultListElementComponent } from '../shared/object-list/my-dspace-result-list-element/wfi-my-dspace-result/wfi-my-dspace-result-list-element.component';
import { ClaimedTaskMyDSpaceResultListElementComponent } from '../shared/object-list/my-dspace-result-list-element/ct-my-dspace-result/ct-my-dspace-result-list-element.component';
import { PoolTaskMyDSpaceResultListElementComponent } from '../shared/object-list/my-dspace-result-list-element/pt-my-dspace-result/pt-my-dspace-result-list-element.component';
import { MyDSpaceNewSubmissionComponent } from './my-dspace-new-submission/my-dspace-new-submission.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MyDspacePageRoutingModule,
    SearchPageModule
  ],
  declarations: [
    ItemMyDSpaceResultListElementComponent,
    MyDSpacePageComponent,
    MyDSpaceResultsComponent,
    WorkspaceitemMyDSpaceResultListElementComponent,
    WorkflowitemMyDSpaceResultListElementComponent,
    ClaimedTaskMyDSpaceResultListElementComponent,
    PoolTaskMyDSpaceResultListElementComponent,
    MyDSpaceNewSubmissionComponent
  ],
  providers: [
    MyDspaceService
  ],
  entryComponents: [
    ItemMyDSpaceResultListElementComponent,
    WorkspaceitemMyDSpaceResultListElementComponent,
    WorkflowitemMyDSpaceResultListElementComponent,
    ClaimedTaskMyDSpaceResultListElementComponent,
    PoolTaskMyDSpaceResultListElementComponent
  ]
})
export class MyDSpacePageModule {

}
