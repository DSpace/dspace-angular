import { MyDSpaceGuard } from './my-dspace.guard';
import { ThemedMyDSpacePageComponent } from './themed-my-dspace-page.component';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';
import { Route } from '@angular/router';
import { provideSuggestionNotifications } from '../notifications/provide-suggestion-notifications';

export const ROUTES: Route[] = [
  {
    path: '',
    component: ThemedMyDSpacePageComponent,
    resolve: {
      breadcrumb: I18nBreadcrumbResolver
    },
    providers: [provideSuggestionNotifications()],
    data: {title: 'mydspace.title', breadcrumbKey: 'mydspace'},
    canActivate: [
      MyDSpaceGuard
    ]
  }
];
