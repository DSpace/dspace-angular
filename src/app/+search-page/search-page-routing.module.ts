import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ConfigurationSearchPageGuard } from './configuration-search-page.guard';
import { ConfigurationSearchPageComponent } from './configuration-search-page.component';
import { SearchPageComponent } from './search-page.component';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { I18nBreadcrumbsService } from '../core/breadcrumbs/i18n-breadcrumbs.service';
import { SearchPageModule } from './search-page.module';

@NgModule({
  imports: [
    SearchPageModule,
    RouterModule.forChild([{
        path: '',
        resolve: { breadcrumb: I18nBreadcrumbResolver }, data: { title: 'search.title', breadcrumbKey: 'search' },
        children: [
          { path: '', component: SearchPageComponent },
          { path: ':configuration', component: ConfigurationSearchPageComponent, canActivate: [ConfigurationSearchPageGuard] }
        ]
      }]
    )
  ],
  providers: [
    I18nBreadcrumbResolver,
    I18nBreadcrumbsService
  ]
})
export class SearchPageRoutingModule {
}
