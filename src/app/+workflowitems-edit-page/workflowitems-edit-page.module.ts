import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { WorkflowItemsEditPageRoutingModule } from './workflowitems-edit-page-routing.module';
import { SubmissionModule } from '../submission/submission.module';
import { WorkflowItemDeleteComponent } from './workflow-item-delete/workflow-item-delete.component';

@NgModule({
  imports: [
    WorkflowItemsEditPageRoutingModule,
    CommonModule,
    SharedModule,
    SubmissionModule,
  ],
  declarations: [WorkflowItemDeleteComponent]
})
/**
 * This module handles all modules that need to access the workflowitems edit page.
 */
export class WorkflowItemsEditPageModule {

}
