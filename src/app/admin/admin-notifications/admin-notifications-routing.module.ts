import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthenticatedGuard } from '../../core/auth/authenticated.guard';
import { I18nBreadcrumbResolver } from '../../core/breadcrumbs/i18n-breadcrumb.resolver';
import { I18nBreadcrumbsService } from '../../core/breadcrumbs/i18n-breadcrumbs.service';
import {  PUBLICATION_CLAIMS_PATH } from './admin-notifications-routing-paths';
import { AdminNotificationsPublicationClaimPageComponent } from './admin-notifications-publication-claim-page/admin-notifications-publication-claim-page.component';
import { QUALITY_ASSURANCE_EDIT_PATH } from './admin-notifications-routing-paths';
import {
  SiteAdministratorGuard
} from '../../core/data/feature-authorization/feature-authorization-guard/site-administrator.guard';
import { QualityAssuranceBreadcrumbResolver } from '../../core/breadcrumbs/quality-assurance-breadcrumb.resolver';
import { QualityAssuranceBreadcrumbService } from '../../core/breadcrumbs/quality-assurance-breadcrumb.service';
import {
  QualityAssuranceEventsPageResolver
} from '../../quality-assurance-notifications-pages/quality-assurance-events-page/quality-assurance-events-page.resolver';
import {
  AdminNotificationsPublicationClaimPageResolver
} from '../../quality-assurance-notifications-pages/notifications-suggestion-targets-page/notifications-suggestion-targets-page-resolver.service';
import {
  QualityAssuranceTopicsPageComponent
} from '../../quality-assurance-notifications-pages/quality-assurance-topics-page/quality-assurance-topics-page.component';
import {
  QualityAssuranceTopicsPageResolver
} from '../../quality-assurance-notifications-pages/quality-assurance-topics-page/quality-assurance-topics-page-resolver.service';
import {
  QualityAssuranceSourcePageComponent
} from '../../quality-assurance-notifications-pages/quality-assurance-source-page-component/quality-assurance-source-page.component';
import {
  QualityAssuranceSourcePageResolver
} from '../../quality-assurance-notifications-pages/quality-assurance-source-page-component/quality-assurance-source-page-resolver.service';
import {
  SourceDataResolver
} from '../../quality-assurance-notifications-pages/quality-assurance-source-page-component/quality-assurance-source-data.resolver';
import {
  QualityAssuranceEventsPageComponent
} from '../../quality-assurance-notifications-pages/quality-assurance-events-page/quality-assurance-events-page.component';


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        canActivate: [ AuthenticatedGuard ],
        path: `${PUBLICATION_CLAIMS_PATH}`,
        component: AdminNotificationsPublicationClaimPageComponent,
        pathMatch: 'full',
        resolve: {
          breadcrumb: I18nBreadcrumbResolver,
          suggestionTargetParams: AdminNotificationsPublicationClaimPageResolver
        },
        data: {
          title: 'admin.notifications.publicationclaim.page.title',
          breadcrumbKey: 'admin.notifications.publicationclaim',
          showBreadcrumbsFluid: false
        }
      },
      {
        canActivate: [ AuthenticatedGuard ],
        path: `${QUALITY_ASSURANCE_EDIT_PATH}/:sourceId`,
        component: QualityAssuranceTopicsPageComponent,
        pathMatch: 'full',
        resolve: {
          breadcrumb: QualityAssuranceBreadcrumbResolver,
          openaireQualityAssuranceTopicsParams: QualityAssuranceTopicsPageResolver
        },
        data: {
          title: 'admin.quality-assurance.page.title',
          breadcrumbKey: 'admin.quality-assurance',
          showBreadcrumbsFluid: false
        }
      },
      {
        canActivate: [ AuthenticatedGuard ],
        path: `${QUALITY_ASSURANCE_EDIT_PATH}/:sourceId/target/:targetId`,
        component: QualityAssuranceTopicsPageComponent,
        pathMatch: 'full',
        resolve: {
          breadcrumb: I18nBreadcrumbResolver,
          openaireQualityAssuranceTopicsParams: QualityAssuranceTopicsPageResolver
        },
        data: {
          title: 'admin.quality-assurance.page.title',
          breadcrumbKey: 'admin.quality-assurance',
          showBreadcrumbsFluid: false
        }
      },
      {
        canActivate: [ SiteAdministratorGuard ],
        path: `${QUALITY_ASSURANCE_EDIT_PATH}`,
        component: QualityAssuranceSourcePageComponent,
        pathMatch: 'full',
        resolve: {
          breadcrumb: I18nBreadcrumbResolver,
          openaireQualityAssuranceSourceParams: QualityAssuranceSourcePageResolver,
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
        component: QualityAssuranceEventsPageComponent,
        pathMatch: 'full',
        resolve: {
          breadcrumb: QualityAssuranceBreadcrumbResolver,
          openaireQualityAssuranceEventsParams: QualityAssuranceEventsPageResolver
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
    AdminNotificationsPublicationClaimPageResolver,
    SourceDataResolver,
    QualityAssuranceSourcePageResolver,
    QualityAssuranceTopicsPageResolver,
    QualityAssuranceEventsPageResolver,
    QualityAssuranceSourcePageResolver,
    QualityAssuranceBreadcrumbResolver,
    QualityAssuranceBreadcrumbService
  ]
})
/**
 * Routing module for the Notifications section of the admin sidebar
 */
export class AdminNotificationsRoutingModule {

}
