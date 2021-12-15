import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';

import { WorkflowItemSearchResultAdminWorkflowGridElementComponent } from './admin-workflow-search-results/admin-workflow-search-result-grid-element/workflow-item/workflow-item-search-result-admin-workflow-grid-element.component';
import { WorkflowItemAdminWorkflowActionsComponent } from './admin-workflow-search-results/workflow-item-admin-workflow-actions.component';
import { WorkflowItemSearchResultAdminWorkflowListElementComponent } from './admin-workflow-search-results/admin-workflow-search-result-list-element/workflow-item/workflow-item-search-result-admin-workflow-list-element.component';
import { AdminWorkflowPageComponent } from './admin-workflow-page.component';
import { SearchModule } from '../../shared/search/search.module';

const ENTRY_COMPONENTS = [
  // put only entry components that use custom decorator
  WorkflowItemSearchResultAdminWorkflowListElementComponent,
  WorkflowItemSearchResultAdminWorkflowGridElementComponent,
];

@NgModule({
  imports: [
    SearchModule,
    SharedModule.withEntryComponents()
  ],
  declarations: [
    AdminWorkflowPageComponent,
    WorkflowItemAdminWorkflowActionsComponent,
    ...ENTRY_COMPONENTS
  ],
  exports: [
    AdminWorkflowPageComponent
  ]
})
export class AdminWorkflowModuleModule {
  /**
   * NOTE: this method allows to resolve issue with components that using a custom decorator
   * which are not loaded during SSR otherwise
   */
  static withEntryComponents() {
    return {
      ngModule: SharedModule,
      providers: ENTRY_COMPONENTS.map((component) => ({provide: component}))
    };
  }
}
