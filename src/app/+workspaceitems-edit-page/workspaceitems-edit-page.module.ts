import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { WorkspaceitemsEditPageRoutingModule } from './workspaceitems-edit-page-routing.module';
import { SubmissionModule } from '../submission/submission.module';

@NgModule({
  imports: [
    WorkspaceitemsEditPageRoutingModule,
    CommonModule,
    SharedModule,
    SubmissionModule,
  ],
  declarations: []
})
export class WorkspaceitemsEditPageModule {

}
