import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { WorkflowItemsEditPageRoutingModule } from './workflowitems-edit-page-routing.module';
import { SubmissionModule } from '../submission/submission.module';
import { WorkflowItemDeleteComponent } from './workflow-item-delete/workflow-item-delete.component';
import { WorkflowItemSendBackComponent } from './workflow-item-send-back/workflow-item-send-back.component';
import { ThemedWorkflowItemDeleteComponent } from './workflow-item-delete/themed-workflow-item-delete.component';
import { ThemedWorkflowItemSendBackComponent } from './workflow-item-send-back/themed-workflow-item-send-back.component';
import { WorkflowItemViewComponent } from './workflow-item-view/workflow-item-view.component';
import { ThemedWorkflowItemViewComponent } from './workflow-item-view/themed-workflow-item-view.component';
import { StatisticsModule } from '../statistics/statistics.module';
import { ItemPageModule } from '../+item-page/item-page.module';

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
    WorkflowItemViewComponent,
    ThemedWorkflowItemViewComponent
  ]
})
/**
 * This module handles all modules that need to access the workflowitems edit page.
 */
export class WorkflowItemsEditPageModule {

}
