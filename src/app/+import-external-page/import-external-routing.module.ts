import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { SubmissionImportExternalComponent } from '../submission/import-external/submission-import-external.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        canActivate: [ AuthenticatedGuard ],
        path: '',
        component: SubmissionImportExternalComponent,
        pathMatch: 'full',
        data: {
          title: 'submission.import-external.page.title'
        }
      }
    ])
  ],
  providers: [ ]
})
export class ImportExternalRoutingModule {

}
