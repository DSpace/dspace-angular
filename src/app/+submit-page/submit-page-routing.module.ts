import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { SubmissionSubmitComponent } from '../submission/submit/submission-submit.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        canActivate: [AuthenticatedGuard],
        path: '',
        pathMatch: 'full',
        component: SubmissionSubmitComponent,
        data: { title: 'submission.submit.title' }
      }
    ])
  ]
})
export class SubmitPageRoutingModule { }
