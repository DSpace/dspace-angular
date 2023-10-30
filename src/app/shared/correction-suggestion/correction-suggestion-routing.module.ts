import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CorrectionSuggestionComponent } from './correction-suggestion.component';
import { I18nBreadcrumbResolver } from '../../core/breadcrumbs/i18n-breadcrumb.resolver';

const routes: Routes = [
  {
    path: ':correctionType',
    component: CorrectionSuggestionComponent,
    resolve: {
      breadcrumb: I18nBreadcrumbResolver
    },
    data: { title: 'item-correction-suggestion.correction-type', breadcrumbKey: 'item-correction-suggestion.correction-type' },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    I18nBreadcrumbResolver
  ]
})
export class CorrectionSuggestionRoutingModule { }
