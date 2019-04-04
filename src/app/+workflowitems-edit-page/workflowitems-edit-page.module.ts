import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { WorkflowitemsEditPageRoutingModule } from './workflowitems-edit-page-routing.module';
import { SubmissionModule } from '../submission/submission.module';

@NgModule({
  imports: [
    WorkflowitemsEditPageRoutingModule,
    CommonModule,
    SharedModule,
    SubmissionModule,
  ],
  declarations: []
})
/**
 * This module handles all modules that need to access the workflowitems edit page.
 */
export class WorkflowitemsEditPageModule {

}
