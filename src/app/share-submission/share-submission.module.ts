import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareSubmissionPageComponent } from './share-submission-page/share-submission-page.component';
import { SharedModule } from '../shared/shared.module';
import { ShareSubmissionPageModule } from './share-submission-page/share-submission-routing.module';
import { ChangeSubmitterPageComponent } from '../change-submitter-page/change-submitter-page.component';

@NgModule({
  declarations: [
    ShareSubmissionPageComponent,
    ChangeSubmitterPageComponent
  ],
  imports: [
    CommonModule,
    ShareSubmissionPageModule,
    SharedModule,
  ]
})
export class ShareSubmissionModule { }
