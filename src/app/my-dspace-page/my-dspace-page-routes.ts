import { Route } from '@angular/router';

import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { provideSuggestionNotifications } from '../notifications/provide-suggestion-notifications';
import { MyDSpaceGuard } from './my-dspace.guard';
import { ThemedMyDSpacePageComponent } from './themed-my-dspace-page.component';

export const ROUTES: Route[] = [
  {
    path: '',
    component: ThemedMyDSpacePageComponent,
    resolve: {
      breadcrumb: I18nBreadcrumbResolver,
    },
    providers: [provideSuggestionNotifications()],
    data: { title: 'mydspace.title', breadcrumbKey: 'mydspace' },
    canActivate: [
      MyDSpaceGuard,
    ],
  },
];
