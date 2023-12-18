import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthenticatedGuard } from '../../core/auth/authenticated.guard';
import { I18nBreadcrumbResolver } from '../../core/breadcrumbs/i18n-breadcrumb.resolver';
import { I18nBreadcrumbsService } from '../../core/breadcrumbs/i18n-breadcrumbs.service';
import { QUALITY_ASSURANCE_EDIT_PATH } from './admin-notifications-routing-paths';
import { AdminQualityAssuranceTopicsPageComponent } from './admin-quality-assurance-topics-page/admin-quality-assurance-topics-page.component';
import { AdminQualityAssuranceEventsPageComponent } from './admin-quality-assurance-events-page/admin-quality-assurance-events-page.component';
import { AdminQualityAssuranceTopicsPageResolver } from './admin-quality-assurance-topics-page/admin-quality-assurance-topics-page-resolver.service';
import { AdminQualityAssuranceEventsPageResolver } from './admin-quality-assurance-events-page/admin-quality-assurance-events-page.resolver';
import { AdminQualityAssuranceSourcePageComponent } from './admin-quality-assurance-source-page-component/admin-quality-assurance-source-page.component';
import { AdminQualityAssuranceSourcePageResolver } from './admin-quality-assurance-source-page-component/admin-quality-assurance-source-page-resolver.service';
import { QualityAssuranceBreadcrumbResolver } from '../../core/breadcrumbs/quality-assurance-breadcrumb.resolver';
import { QualityAssuranceBreadcrumbService } from '../../core/breadcrumbs/quality-assurance-breadcrumb.service';
import {
  SourceDataResolver
} from './admin-quality-assurance-source-page-component/admin-quality-assurance-source-data.resolver';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        canActivate: [ AuthenticatedGuard ],
        path: `${QUALITY_ASSURANCE_EDIT_PATH}/:sourceId`,
        component: AdminQualityAssuranceTopicsPageComponent,
        pathMatch: 'full',
        resolve: {
          breadcrumb: QualityAssuranceBreadcrumbResolver,
          openaireQualityAssuranceTopicsParams: AdminQualityAssuranceTopicsPageResolver
        },
        data: {
          title: 'admin.quality-assurance.page.title',
          breadcrumbKey: 'admin.quality-assurance',
          showBreadcrumbsFluid: false
        }
      },
      {
        canActivate: [ AuthenticatedGuard ],
        path: `${QUALITY_ASSURANCE_EDIT_PATH}`,
        component: AdminQualityAssuranceSourcePageComponent,
        pathMatch: 'full',
        resolve: {
          breadcrumb: I18nBreadcrumbResolver,
          openaireQualityAssuranceSourceParams: AdminQualityAssuranceSourcePageResolver,
          sourceData: SourceDataResolver
        },
        data: {
          title: 'admin.notifications.source.breadcrumbs',
          breadcrumbKey: 'admin.notifications.source',
          showBreadcrumbsFluid: false
        }
      },
      {
        canActivate: [ AuthenticatedGuard ],
        path: `${QUALITY_ASSURANCE_EDIT_PATH}/:sourceId/:topicId`,
        component: AdminQualityAssuranceEventsPageComponent,
        pathMatch: 'full',
        resolve: {
          breadcrumb: QualityAssuranceBreadcrumbResolver,
          openaireQualityAssuranceEventsParams: AdminQualityAssuranceEventsPageResolver
        },
        data: {
          title: 'admin.notifications.event.page.title',
          breadcrumbKey: 'admin.notifications.event',
          showBreadcrumbsFluid: false
        }
      }
    ])
  ],
  providers: [
    I18nBreadcrumbResolver,
    I18nBreadcrumbsService,
    SourceDataResolver,
    AdminQualityAssuranceTopicsPageResolver,
    AdminQualityAssuranceEventsPageResolver,
    AdminQualityAssuranceSourcePageResolver,
    QualityAssuranceBreadcrumbResolver,
    QualityAssuranceBreadcrumbService
  ]
})
/**
 * Routing module for the Notifications section of the admin sidebar
 */
export class AdminNotificationsRoutingModule {

}
