import { SuggestionsPageResolver } from './suggestions-page.resolver';
import { SuggestionsPageComponent } from './suggestions-page.component';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { PublicationClaimBreadcrumbResolver } from '../core/breadcrumbs/publication-claim-breadcrumb.resolver';
import { Route } from '@angular/router';
import { provideSuggestionNotifications } from '../notifications/provide-suggestion-notifications';

export const ROUTES: Route[] = [
  {
    path: ':targetId',
    resolve: {
      suggestionTargets: SuggestionsPageResolver,
      breadcrumb: PublicationClaimBreadcrumbResolver//I18nBreadcrumbResolver
    },
    data: {
      title: 'admin.notifications.publicationclaim.page.title',
      breadcrumbKey: 'admin.notifications.publicationclaim',
      showBreadcrumbsFluid: false
    },
    providers: [
      SuggestionsPageResolver,
      PublicationClaimBreadcrumbResolver,
      provideSuggestionNotifications()
    ],
    canActivate: [AuthenticatedGuard],
    runGuardsAndResolvers: 'always',
    component: SuggestionsPageComponent,
  },
];
