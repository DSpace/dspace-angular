import { Route } from '@angular/router';
import {
  authenticatedGuard,
  publicationClaimBreadcrumbResolver,
} from '@dspace/core';

import { SuggestionsPageComponent } from './suggestions-page.component';
import { suggestionsPageResolver } from './suggestions-page.resolver';

export const ROUTES: Route[] = [
  {
    path: ':targetId',
    resolve: {
      suggestionTargets: suggestionsPageResolver,
      breadcrumb: publicationClaimBreadcrumbResolver,//i18nBreadcrumbResolver
    },
    data: {
      title: 'admin.notifications.publicationclaim.page.title',
      breadcrumbKey: 'admin.notifications.publicationclaim',
      showBreadcrumbsFluid: false,
    },
    canActivate: [authenticatedGuard],
    runGuardsAndResolvers: 'always',
    component: SuggestionsPageComponent,
  },
];
