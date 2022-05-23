import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExplorePageComponent } from './explore-page.component';
import { ExploreI18nBreadcrumbResolver } from './explore-i18n-breadcrumb.resolver';
import { EndUserAgreementCurrentUserGuard } from '../core/end-user-agreement/end-user-agreement-current-user.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':id',
        component: ExplorePageComponent,
        resolve: { breadcrumb: ExploreI18nBreadcrumbResolver },
        data: { title: 'explore.title', breadcrumbKey: 'explore', showSocialButtons: true },
        canActivate: [EndUserAgreementCurrentUserGuard]
      },
    ])
  ],
  providers: [
     ExploreI18nBreadcrumbResolver,
  ]
})
export class ExploreRoutingModule {

}
