import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { SubmissionEditComponent } from '../submission/edit/submission-edit.component';
import { EDIT_ITEM_PATH } from './edit-item-routing-paths';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':id',
        runGuardsAndResolvers: 'always',
        children: [
          {
            path: '',
            canActivate: [AuthenticatedGuard],
            component: SubmissionEditComponent,
            data: { title: 'submission.edit.title' }
          }
        ],
      }
    ])
  ],
  providers: []
})
export class EditItemRoutingModule {

}
