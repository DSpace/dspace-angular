import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { SubmissionModule } from '../submission/submission.module';
import { EditItemRoutingModule } from './edit-item-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    SubmissionModule,
    EditItemRoutingModule
  ]
})
export class EditItemModule { }
