import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { PendingChangesGuard } from '../submission/edit/pending-changes/pending-changes.guard';
import { ThemedSubmissionEditComponent } from '../submission/edit/themed-submission-edit.component';

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
            canDeactivate: [PendingChangesGuard],
            component: ThemedSubmissionEditComponent,
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
