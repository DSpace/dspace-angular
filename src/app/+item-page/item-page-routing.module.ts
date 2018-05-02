import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ItemPageComponent } from './simple/item-page.component';
import { FullItemPageComponent } from './full/full-item-page.component';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { SubmissionEditComponent } from '../submission/edit/submission-edit.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: ':id', component: ItemPageComponent, pathMatch: 'full' },
      {
        canActivate: [AuthenticatedGuard],
        path: ':id/edit',
        component: SubmissionEditComponent,
        data: { title: 'submission.edit.title' }
      },
      { path: ':id/full', component: FullItemPageComponent }
    ])
  ]
})
export class ItemPageRoutingModule {

}
