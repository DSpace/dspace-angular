import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { I18nBreadcrumbsService } from '../core/breadcrumbs/i18n-breadcrumbs.service';
import { StatisticsPageModule } from './statistics-page.module';
import { SiteStatisticsPageComponent } from './site-statistics-page/site-statistics-page.component';
import { ItemPageResolver } from '../+item-page/item-page.resolver';
import { ItemStatisticsPageComponent } from './item-statistics-page/item-statistics-page.component';
import { CollectionPageResolver } from '../+collection-page/collection-page.resolver';
import { CollectionStatisticsPageComponent } from './collection-statistics-page/collection-statistics-page.component';
import { CommunityPageResolver } from '../+community-page/community-page.resolver';
import { CommunityStatisticsPageComponent } from './community-statistics-page/community-statistics-page.component';

@NgModule({
  imports: [
    StatisticsPageModule,
    RouterModule.forChild([
        {
          path: '',
          resolve: {
            breadcrumb: I18nBreadcrumbResolver
          },
          data: {
            title: 'statistics.title',
            breadcrumbKey: 'statistics'
          },
          children: [
            {
              path: '',
              component: SiteStatisticsPageComponent,
            },
          ]
        },
        {
          path: `items/:id`,
          resolve: {
            scope: ItemPageResolver,
            breadcrumb: I18nBreadcrumbResolver
          },
          data: {
            title: 'statistics.title',
            breadcrumbKey: 'statistics'
          },
          component: ItemStatisticsPageComponent,
        },
        {
          path: `collections/:id`,
          resolve: {
            scope: CollectionPageResolver,
            breadcrumb: I18nBreadcrumbResolver
          },
          data: {
            title: 'statistics.title',
            breadcrumbKey: 'statistics'
          },
          component: CollectionStatisticsPageComponent,
        },
        {
          path: `communities/:id`,
          resolve: {
            scope: CommunityPageResolver,
            breadcrumb: I18nBreadcrumbResolver
          },
          data: {
            title: 'statistics.title',
            breadcrumbKey: 'statistics'
          },
          component: CommunityStatisticsPageComponent,
        },
      ]
    )
  ],
  providers: [
    I18nBreadcrumbResolver,
    I18nBreadcrumbsService,
    CollectionPageResolver,
    CommunityPageResolver,
  ]
})
export class StatisticsPageRoutingModule {
}
