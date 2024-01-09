import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SubmitPageRoutingModule } from './submit-page-routing.module';
import { SubmissionModule } from '../submission/submission.module';
import { FormModule } from '../shared/form/form.module';

@NgModule({
  imports: [
    SubmitPageRoutingModule,
    CommonModule,
    SubmissionModule,
    FormModule,
  ],
})
/**
 * This module handles all modules that need to access the submit page.
 */
export class SubmitPageModule {

}
