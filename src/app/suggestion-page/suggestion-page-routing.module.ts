import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SuggestionPageResolver } from './suggestion-page.resolver';
import { SuggestionPageComponent } from './suggestion-page.component';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':id/:name',
        resolve: {
          suggestion: SuggestionPageResolver,
          breadcrumb: I18nBreadcrumbResolver
        },
        data: {
          title: 'admin.notifications.recitersuggestion.page.title',
          breadcrumbKey: 'admin.notifications.recitersuggestion',
          showBreadcrumbsFluid: false
        },
        canActivate: [AuthenticatedGuard],
        runGuardsAndResolvers: 'always',
        component: SuggestionPageComponent,
      },
    ])
  ],
  providers: [
    SuggestionPageResolver
  ]
})
export class SuggestionPageRoutingModule {

}
