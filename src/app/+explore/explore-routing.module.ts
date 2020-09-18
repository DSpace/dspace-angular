import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExploreComponent } from './explore.component';
import { ExploreI18nBreadcrumbResolver } from './explore-i18n-breadcrumb.resolver';
import { EndUserAgreementCurrentUserGuard } from '../core/end-user-agreement/end-user-agreement-current-user.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':id',
        component: ExploreComponent,
        resolve: { breadcrumb: ExploreI18nBreadcrumbResolver },
        data: { title: 'explore.title', breadcrumbKey: 'explore' },
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
