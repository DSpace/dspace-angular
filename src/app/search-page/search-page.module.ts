import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../shared/shared.module';
import { SearchPageRoutingModule } from './search-page-routing.module';
import { SearchPageComponent } from './search-page.component';
import { SearchFormComponent } from '../shared/search-form/search-form.component';
import { SearchResultsComponent } from './search-results/search-results.compontent';

@NgModule({
  imports: [
    SearchPageRoutingModule,
    CommonModule,
    TranslateModule,
    RouterModule,
    SharedModule,
  ],
  declarations: [
    SearchPageComponent,
    SearchFormComponent,
    SearchResultsComponent
  ]
})
export class SearchPageModule { }
