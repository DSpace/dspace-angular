import { Route } from '@angular/router';

import { endUserAgreementCurrentUserGuard } from '../core/end-user-agreement/end-user-agreement-current-user.guard';
import { ExploreI18nBreadcrumbResolver } from './explore-i18n-breadcrumb.resolver';
import { ExplorePageComponent } from './explore-page.component';

export const ROUTES: Route[] = [
  {
    path: ':id',
    component: ExplorePageComponent,
    resolve: { breadcrumb: ExploreI18nBreadcrumbResolver },
    data: { title: 'explore.title', breadcrumbKey: 'explore', showSocialButtons: true },
    canActivate: [endUserAgreementCurrentUserGuard],
    providers: [ExploreI18nBreadcrumbResolver],
  },
];
