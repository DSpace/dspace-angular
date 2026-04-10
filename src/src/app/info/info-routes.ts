import {
  Route,
  Routes,
} from '@angular/router';

import { environment } from '../../environments/environment';
import { i18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { notifyInfoGuard } from '../core/coar-notify/notify-info/notify-info.guard';
import { feedbackGuard } from '../core/feedback/feedback.guard';
import { hasValue } from '../shared/empty.util';
import { ThemedAboutComponent } from './about/themed-about.component';
import { AccessibilitySettingsComponent } from './accessibility-settings/accessibility-settings.component';
import { ThemedContributorsComponent } from './contributors/themed-contributors.component';
import { ThemedHelpComponent } from './help/themed-help.component';
import { ThemedEndUserAgreementComponent } from './end-user-agreement/themed-end-user-agreement.component';
import { ThemedFeedbackComponent } from './feedback/themed-feedback.component';
import { ThemedCitationComponent } from './citation/themed-citation.component';
import {
  ABOUT_PATH,
  ACCESSIBILITY_SETTINGS_PATH,
  CITATION_PATH,
  COAR_NOTIFY_SUPPORT,
  CONTRIBUTORS_PATH,
  END_USER_AGREEMENT_PATH,
  FEEDBACK_PATH,
  HELP_PATH,
  PRIVACY_PATH,
} from './info-routing-paths';
import { ThemedNotifyInfoComponent } from './notify-info/themed-notify-info.component';
import { ThemedPrivacyComponent } from './privacy/themed-privacy.component';


export const ROUTES: Routes = [
  {
    path: ABOUT_PATH,
    component: ThemedAboutComponent,
    resolve: { breadcrumb: i18nBreadcrumbResolver },
    data: { title: 'info.about.title', breadcrumbKey: 'info.about' },
  },
  {
    path: CONTRIBUTORS_PATH,
    component: ThemedContributorsComponent,
    resolve: { breadcrumb: i18nBreadcrumbResolver },
    data: { title: 'info.contributors.title', breadcrumbKey: 'info.contributors' },
  },
  {
    path: HELP_PATH,
    component: ThemedHelpComponent,
    resolve: { breadcrumb: i18nBreadcrumbResolver },
    data: { title: 'info.help.title', breadcrumbKey: 'info.help' },
  },
  {
    path: CITATION_PATH,
    component: ThemedCitationComponent,
    resolve: { breadcrumb: i18nBreadcrumbResolver },
    data: { title: 'info.citation.title', breadcrumbKey: 'info.citation' },
  },
  {
    path: FEEDBACK_PATH,
    component: ThemedFeedbackComponent,
    resolve: { breadcrumb: i18nBreadcrumbResolver },
    data: { title: 'info.feedback.title', breadcrumbKey: 'info.feedback' },
    canActivate: [feedbackGuard],
  },
  {
    path: ACCESSIBILITY_SETTINGS_PATH,
    component: AccessibilitySettingsComponent,
    resolve: { breadcrumb: i18nBreadcrumbResolver },
    data: { title: 'info.accessibility-settings.title', breadcrumbKey: 'info.accessibility-settings' },
  },
  environment.info.enableEndUserAgreement ? {
    path: END_USER_AGREEMENT_PATH,
    component: ThemedEndUserAgreementComponent,
    resolve: { breadcrumb: i18nBreadcrumbResolver },
    data: { title: 'info.end-user-agreement.title', breadcrumbKey: 'info.end-user-agreement' },
  } : undefined,
  environment.info.enablePrivacyStatement ? {
    path: PRIVACY_PATH,
    component: ThemedPrivacyComponent,
    resolve: { breadcrumb: i18nBreadcrumbResolver },
    data: { title: 'info.privacy.title', breadcrumbKey: 'info.privacy' },
  } : undefined,
  environment.info.enableCOARNotifySupport ? {
    path: COAR_NOTIFY_SUPPORT,
    component: ThemedNotifyInfoComponent,
    canActivate: [notifyInfoGuard],
    resolve: {
      breadcrumb: i18nBreadcrumbResolver,
    },
    data: {
      title: 'info.coar-notify-support.title',
      breadcrumbKey: 'info.coar-notify-support',
    },
  } : undefined,
].filter((route: Route) => hasValue(route));
