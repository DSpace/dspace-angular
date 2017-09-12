import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SubmissionSubmitComponent } from './submit/submission-submit.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'submit', component: SubmissionSubmitComponent }
    ])
  ]
})
export class SubmissionRoutingModule { }
