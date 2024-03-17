import { Route } from '@angular/router';

import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { QualityAssuranceBreadcrumbResolver } from '../core/breadcrumbs/quality-assurance-breadcrumb.resolver';
import {
  NOTIFICATIONS_RECITER_SUGGESTION_PATH,
  QUALITY_ASSURANCE_EDIT_PATH,
} from './notifications-pages-routing-paths';
import { NotificationsSuggestionTargetsPageComponent } from './notifications-suggestion-targets-page/notifications-suggestion-targets-page.component';
import { AdminNotificationsPublicationClaimPageResolver } from './notifications-suggestion-targets-page/notifications-suggestion-targets-page-resolver.service';
import { QualityAssuranceEventsPageComponent } from './quality-assurance-events-page/quality-assurance-events-page.component';
import { QualityAssuranceEventsPageResolver } from './quality-assurance-events-page/quality-assurance-events-page.resolver';
import { SourceDataResolver } from './quality-assurance-source-page-component/quality-assurance-source-data.resolver';
import { QualityAssuranceSourcePageComponent } from './quality-assurance-source-page-component/quality-assurance-source-page.component';
import { QualityAssuranceSourcePageResolver } from './quality-assurance-source-page-component/quality-assurance-source-page-resolver.service';
import { QualityAssuranceTopicsPageComponent } from './quality-assurance-topics-page/quality-assurance-topics-page.component';
import { QualityAssuranceTopicsPageResolver } from './quality-assurance-topics-page/quality-assurance-topics-page-resolver.service';

export const ROUTES: Route[] = [
  {
    canActivate: [AuthenticatedGuard],
    path: `${NOTIFICATIONS_RECITER_SUGGESTION_PATH}`,
    component: NotificationsSuggestionTargetsPageComponent,
    pathMatch: 'full',
    resolve: {
      breadcrumb: I18nBreadcrumbResolver,
      reciterSuggestionTargetParams: AdminNotificationsPublicationClaimPageResolver,
    },
    data: {
      title: 'admin.notifications.recitersuggestion.page.title',
      breadcrumbKey: 'admin.notifications.recitersuggestion',
      showBreadcrumbsFluid: false,
    },
  },
  {
    canActivate: [AuthenticatedGuard],
    path: `${QUALITY_ASSURANCE_EDIT_PATH}/:sourceId`,
    component: QualityAssuranceTopicsPageComponent,
    pathMatch: 'full',
    resolve: {
      breadcrumb: QualityAssuranceBreadcrumbResolver,
      openaireQualityAssuranceTopicsParams: QualityAssuranceTopicsPageResolver,
    },
    data: {
      title: 'admin.quality-assurance.page.title',
      breadcrumbKey: 'admin.quality-assurance',
      showBreadcrumbsFluid: false,
    },
  },
  {
    canActivate: [AuthenticatedGuard],
    path: `${QUALITY_ASSURANCE_EDIT_PATH}/:sourceId/target/:targetId`,
    component: QualityAssuranceTopicsPageComponent,
    pathMatch: 'full',
    resolve: {
      breadcrumb: I18nBreadcrumbResolver,
      openaireQualityAssuranceTopicsParams: QualityAssuranceTopicsPageResolver,
    },
    data: {
      title: 'admin.quality-assurance.page.title',
      breadcrumbKey: 'admin.quality-assurance',
      showBreadcrumbsFluid: false,
    },
  },
  {
    canActivate: [AuthenticatedGuard],
    path: `${QUALITY_ASSURANCE_EDIT_PATH}`,
    component: QualityAssuranceSourcePageComponent,
    pathMatch: 'full',
    resolve: {
      breadcrumb: I18nBreadcrumbResolver,
      openaireQualityAssuranceSourceParams: QualityAssuranceSourcePageResolver,
      sourceData: SourceDataResolver,
    },
    data: {
      title: 'admin.notifications.source.breadcrumbs',
      breadcrumbKey: 'admin.notifications.source',
      showBreadcrumbsFluid: false,
    },
  },
  {
    canActivate: [AuthenticatedGuard],
    path: `${QUALITY_ASSURANCE_EDIT_PATH}/:sourceId/:topicId`,
    component: QualityAssuranceEventsPageComponent,
    pathMatch: 'full',
    resolve: {
      breadcrumb: QualityAssuranceBreadcrumbResolver,
      openaireQualityAssuranceEventsParams: QualityAssuranceEventsPageResolver,
    },
    data: {
      title: 'admin.notifications.event.page.title',
      breadcrumbKey: 'admin.notifications.event',
      showBreadcrumbsFluid: false,
    },
  },
];
