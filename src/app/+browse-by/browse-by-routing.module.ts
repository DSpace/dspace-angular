import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowseByGuard } from './browse-by-guard';
import { BrowseBySwitcherComponent } from './+browse-by-switcher/browse-by-switcher.component';
import { BrowseByDSOBreadcrumbResolver } from './browse-by-dso-breadcrumb.resolver';
import { BrowseByI18nBreadcrumbResolver } from './browse-by-i18n-breadcrumb.resolver';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        resolve: { breadcrumb: BrowseByDSOBreadcrumbResolver },
        children: [
          {
            path: ':id',
            component: BrowseBySwitcherComponent,
            canActivate: [BrowseByGuard],
            resolve: { breadcrumb: BrowseByI18nBreadcrumbResolver },
            data: { title: 'browse.title', breadcrumbKey: 'browse.metadata' }
          }
        ]
      }])
  ],
  providers: [
    BrowseByI18nBreadcrumbResolver,
    BrowseByDSOBreadcrumbResolver
  ]
})
export class BrowseByRoutingModule {

}
