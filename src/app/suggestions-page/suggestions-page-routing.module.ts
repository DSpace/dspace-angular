import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SuggestionsPageResolver } from './suggestions-page.resolver';
import { SuggestionsPageComponent } from './suggestions-page.component';
import { AuthenticatedGuard } from '../core/auth/authenticated.guard';
import { I18nBreadcrumbResolver } from '../core/breadcrumbs/i18n-breadcrumb.resolver';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: ':targetId',
        resolve: {
          suggestionTargets: SuggestionsPageResolver,
          breadcrumb: I18nBreadcrumbResolver
        },
        data: {
          title: 'admin.notifications.recitersuggestion.page.title',
          breadcrumbKey: 'admin.notifications.recitersuggestion',
          showBreadcrumbsFluid: false
        },
        canActivate: [AuthenticatedGuard],
        runGuardsAndResolvers: 'always',
        component: SuggestionsPageComponent,
      },
    ])
  ],
  providers: [
    SuggestionsPageResolver
  ]
})
export class SuggestionsPageRoutingModule {

}
