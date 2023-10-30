import { ItemBreadcrumbResolver } from './../../core/breadcrumbs/item-breadcrumb.resolver';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CorrectionSuggestionComponent } from './correction-suggestion.component';

const routes: Routes = [
  {
    path: ':correctionType',
    component: CorrectionSuggestionComponent,
    resolve: {
      breadcrumb: ItemBreadcrumbResolver,
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    ItemBreadcrumbResolver
  ]
})
export class CorrectionSuggestionRoutingModule { }
