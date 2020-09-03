import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExploreComponent } from './explore.component';
import { ExploreI18nBreadcrumbResolver } from './explore-i18n-breadcrumb.resolver';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':id',
        component: ExploreComponent,
        resolve: { breadcrumb: ExploreI18nBreadcrumbResolver },
        data: { title: 'explore.title', breadcrumbKey: 'explore' }
      },
    ])
  ],
  providers: [
     ExploreI18nBreadcrumbResolver,
  ]
})
export class ExploreRoutingModule {

}
