import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AdminAccessControlModule } from './admin-access-control/admin-access-control.module';
import { MetadataImportPageComponent } from './admin-import-metadata-page/metadata-import-page.component';
import { AdminRegistriesModule } from './admin-registries/admin-registries.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminSearchPageComponent } from './admin-search-page/admin-search-page.component';
import { SearchPageModule } from '../+search-page/search-page.module';
import { ItemAdminSearchResultListElementComponent } from './admin-search-page/admin-search-results/admin-search-result-list-element/item-search-result/item-admin-search-result-list-element.component';
import { CommunityAdminSearchResultListElementComponent } from './admin-search-page/admin-search-results/admin-search-result-list-element/community-search-result/community-admin-search-result-list-element.component';
import { CollectionAdminSearchResultListElementComponent } from './admin-search-page/admin-search-results/admin-search-result-list-element/collection-search-result/collection-admin-search-result-list-element.component';
import { ItemAdminSearchResultGridElementComponent } from './admin-search-page/admin-search-results/admin-search-result-grid-element/item-search-result/item-admin-search-result-grid-element.component';
import { CommunityAdminSearchResultGridElementComponent } from './admin-search-page/admin-search-results/admin-search-result-grid-element/community-search-result/community-admin-search-result-grid-element.component';
import { CollectionAdminSearchResultGridElementComponent } from './admin-search-page/admin-search-results/admin-search-result-grid-element/collection-search-result/collection-admin-search-result-grid-element.component';
import { ItemAdminSearchResultActionsComponent } from './admin-search-page/admin-search-results/item-admin-search-result-actions.component';
import { WorkflowItemSearchResultAdminWorkflowGridElementComponent } from './admin-workflow-page/admin-workflow-search-results/admin-workflow-search-result-grid-element/workflow-item/workflow-item-search-result-admin-workflow-grid-element.component';
import { WorkflowItemAdminWorkflowActionsComponent } from './admin-workflow-page/admin-workflow-search-results/workflow-item-admin-workflow-actions.component';
import { WorkflowItemSearchResultAdminWorkflowListElementComponent } from './admin-workflow-page/admin-workflow-search-results/admin-workflow-search-result-list-element/workflow-item/workflow-item-search-result-admin-workflow-list-element.component';
import { AdminWorkflowPageComponent } from './admin-workflow-page/admin-workflow-page.component';
import { AdminCurationTasksComponent } from './admin-curation-tasks/admin-curation-tasks.component';

@NgModule({
  imports: [
    AdminRoutingModule,
    AdminRegistriesModule,
    AdminAccessControlModule,
    SharedModule,
    SearchPageModule
  ],
  declarations: [
    AdminSearchPageComponent,
    AdminWorkflowPageComponent,
    ItemAdminSearchResultListElementComponent,
    CommunityAdminSearchResultListElementComponent,
    CollectionAdminSearchResultListElementComponent,
    ItemAdminSearchResultGridElementComponent,
    CommunityAdminSearchResultGridElementComponent,
    CollectionAdminSearchResultGridElementComponent,
    ItemAdminSearchResultActionsComponent,
    AdminCurationTasksComponent,

    WorkflowItemSearchResultAdminWorkflowListElementComponent,
    WorkflowItemSearchResultAdminWorkflowGridElementComponent,
    WorkflowItemAdminWorkflowActionsComponent,

    MetadataImportPageComponent

  ],
  entryComponents: [
    ItemAdminSearchResultListElementComponent,
    CommunityAdminSearchResultListElementComponent,
    CollectionAdminSearchResultListElementComponent,
    ItemAdminSearchResultGridElementComponent,
    CommunityAdminSearchResultGridElementComponent,
    CollectionAdminSearchResultGridElementComponent,
    ItemAdminSearchResultActionsComponent,

    WorkflowItemSearchResultAdminWorkflowListElementComponent,
    WorkflowItemSearchResultAdminWorkflowGridElementComponent,
    WorkflowItemAdminWorkflowActionsComponent,

    MetadataImportPageComponent
  ]
})
export class AdminModule {

}
