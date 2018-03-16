import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { SubmitPageComponent } from './submit-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        canActivate: [AuthenticatedGuard],
        path: '',
        pathMatch: 'full',
        component: SubmitPageComponent,
        data: { title: 'submission.submit.title' }
      }
    ])
  ]
})
export class SubmitPageRoutingModule { }
