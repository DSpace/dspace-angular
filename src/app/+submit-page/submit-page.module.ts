import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { SubmitPageRoutingModule } from './submit-page-routing.module';
import { SubmissionModule } from '../submission/submission.module';

@NgModule({
  imports: [
    SubmitPageRoutingModule,
    CommonModule,
    SharedModule,
    SubmissionModule,
  ],
})
export class SubmitPageModule {

}
