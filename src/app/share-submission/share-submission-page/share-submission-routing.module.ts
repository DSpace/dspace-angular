import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ShareSubmissionPageComponent } from './share-submission-page.component';
import { I18nBreadcrumbResolver } from '../../core/breadcrumbs/i18n-breadcrumb.resolver';
import { ChangeSubmitterPageComponent } from '../../change-submitter-page/change-submitter-page.component';

const routes: Routes = [
  { path: '',
    component: ShareSubmissionPageComponent,
    resolve: { breadcrumb: I18nBreadcrumbResolver },
    data: {
      breadcrumbKey: 'share.submission',
    },
  },
  { path: 'change-submitter',
    component: ChangeSubmitterPageComponent,
    resolve: { breadcrumb: I18nBreadcrumbResolver },
    data: {
      breadcrumbKey: 'change.submitter',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShareSubmissionPageModule { }
