import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SubmissionSubmitComponent } from './submit/submission-submit.component';
import { SubmissionEditComponent } from './edit/submission-edit.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'edit/:id', component: SubmissionEditComponent },
      { path: 'submit', component: SubmissionSubmitComponent }
    ])
  ]
})
export class SubmissionRoutingModule { }
