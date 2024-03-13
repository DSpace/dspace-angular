import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormModule } from '../shared/form/form.module';
import { SharedModule } from '../shared/shared.module';
import { SubmissionModule } from '../submission/submission.module';
import { SubmitPageRoutingModule } from './submit-page-routing.module';

@NgModule({
  imports: [
    SubmitPageRoutingModule,
    CommonModule,
    SharedModule,
    SubmissionModule,
    FormModule,
  ],
})
/**
 * This module handles all modules that need to access the submit page.
 */
export class SubmitPageModule {

}
