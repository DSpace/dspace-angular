import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { WorkflowItemsEditPageRoutingModule } from './workflowitems-edit-page-routing.module';
import { SubmissionModule } from '../submission/submission.module';
import { WorkflowItemDeleteComponent } from './workflow-item-delete/workflow-item-delete.component';
import { WorkflowItemSendBackComponent } from './workflow-item-send-back/workflow-item-send-back.component';
import { ThemedWorkflowItemDeleteComponent } from './workflow-item-delete/themed-workflow-item-delete.component';
import { ThemedWorkflowItemSendBackComponent } from './workflow-item-send-back/themed-workflow-item-send-back.component';
import { StatisticsModule } from '../statistics/statistics.module';
import { ItemPageModule } from '../item-page/item-page.module';
import {
  AdvancedWorkflowActionsLoaderComponent
} from './advanced-workflow-action/advanced-workflow-actions-loader/advanced-workflow-actions-loader.component';
import { AdvancedWorkflowActionRatingReviewerComponent } from './advanced-workflow-action/advanced-workflow-action-rating-reviewer/advanced-workflow-action-rating-reviewer.component';
import { AdvancedWorkflowActionSelectReviewerComponent } from './advanced-workflow-action/advanced-workflow-action-select-reviewer/advanced-workflow-action-select-reviewer.component';
import { AdvancedWorkflowActionPageComponent } from './advanced-workflow-action/advanced-workflow-action-page/advanced-workflow-action-page.component';
import {
  AdvancedClaimedTaskActionsDirective
} from './advanced-workflow-action/advanced-workflow-actions-loader/advanced-claimed-task-actions.directive';

@NgModule({
  imports: [
    WorkflowItemsEditPageRoutingModule,
    CommonModule,
    SharedModule,
    SubmissionModule,
    StatisticsModule,
    ItemPageModule
  ],
  declarations: [
    WorkflowItemDeleteComponent,
    ThemedWorkflowItemDeleteComponent,
    WorkflowItemSendBackComponent,
    ThemedWorkflowItemSendBackComponent,
    AdvancedWorkflowActionsLoaderComponent,
    AdvancedWorkflowActionRatingReviewerComponent,
    AdvancedWorkflowActionSelectReviewerComponent,
    AdvancedWorkflowActionPageComponent,
    AdvancedClaimedTaskActionsDirective,
  ]
})
/**
 * This module handles all modules that need to access the workflowitems edit page.
 */
export class WorkflowItemsEditPageModule {

}
