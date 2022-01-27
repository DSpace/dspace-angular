import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { I18nBreadcrumbsService } from '../core/breadcrumbs/i18n-breadcrumbs.service';
import { StatisticsPageModule } from './statistics-page.module';
import { CollectionPageResolver } from '../collection-page/collection-page.resolver';
import { CommunityPageResolver } from '../community-page/community-page.resolver';
import { StatisticsItemPageResolver } from './statistics-item-page.resolver';
import { ThemedCollectionStatisticsPageComponent } from './collection-statistics-page/themed-collection-statistics-page.component';
import { ThemedCommunityStatisticsPageComponent } from './community-statistics-page/themed-community-statistics-page.component';
import { ThemedItemStatisticsPageComponent } from './item-statistics-page/themed-item-statistics-page.component';
import { ThemedSiteStatisticsPageComponent } from './site-statistics-page/themed-site-statistics-page.component';
import { DsoContextBreadcrumbResolver } from '../core/breadcrumbs/dso-context-breadcrumb.resolver';
import { WorkflowStatisticsPageComponent } from './workflow-statistics-page/workflow-statistics-page.component';
import { LoginStatisticsPageComponent } from './login-statistics-page/login-statistics-page.component';

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
            breadcrumbKey: 'statistics',
            type: 'site'
          },
          children: [
            {
              path: '',
              component: ThemedSiteStatisticsPageComponent,
            },
          ]
        },
        {
          path: 'login',
          resolve: {
            breadcrumb: I18nBreadcrumbResolver
          },
          data: {
            title: 'statistics.login.title',
            breadcrumbKey: 'statistics.login',
          },
          children: [
            {
              path: '',
              component: LoginStatisticsPageComponent,
           },
          ]
        },
        {
          path: 'workflow',
          resolve: {
            breadcrumb: I18nBreadcrumbResolver
          },
          data: {
            title: 'statistics.workflow.title',
            breadcrumbKey: 'statistics.workflow',
          },
          children: [
            {
              path: '',
              component: WorkflowStatisticsPageComponent,
            },
          ]
        },
        {
          path: `items/:id`,
          resolve: {
            scope: StatisticsItemPageResolver,
            breadcrumb: DsoContextBreadcrumbResolver
          },
          data: {
            title: 'statistics.title',
            breadcrumbKey: 'statistics'
          },
          component: ThemedItemStatisticsPageComponent,
        },
        {
          path: `collections/:id`,
          resolve: {
            scope: CollectionPageResolver,
            breadcrumb: DsoContextBreadcrumbResolver
          },
          data: {
            title: 'statistics.title',
            breadcrumbKey: 'statistics'
          },
          component: ThemedCollectionStatisticsPageComponent,
        },
        {
          path: `communities/:id`,
          resolve: {
            scope: CommunityPageResolver,
            breadcrumb: DsoContextBreadcrumbResolver
          },
          data: {
            title: 'statistics.title',
            breadcrumbKey: 'statistics'
          },
          component: ThemedCommunityStatisticsPageComponent,
        },
      ]
    )
  ],
  providers: [
    I18nBreadcrumbResolver,
    I18nBreadcrumbsService,
    CollectionPageResolver,
    CommunityPageResolver,
    StatisticsItemPageResolver
  ]
})
export class StatisticsPageRoutingModule {
}
