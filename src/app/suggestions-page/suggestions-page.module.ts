import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuggestionsPageComponent } from './suggestions-page.component';
import { SharedModule } from '../shared/shared.module';
import { SuggestionsPageRoutingModule } from './suggestions-page-routing.module';
import { SuggestionsService } from '../openaire/reciter-suggestions/suggestions.service';
import { OpenaireSuggestionsDataService } from '../core/openaire/reciter-suggestions/openaire-suggestions-data.service';
import { OpenaireModule } from '../openaire/openaire.module';

@NgModule({
  declarations: [SuggestionsPageComponent],
  imports: [
    CommonModule,
    SharedModule,
    OpenaireModule,
    SuggestionsPageRoutingModule
  ],
  providers: [
    OpenaireSuggestionsDataService,
    SuggestionsService
  ]
})
export class SuggestionsPageModule { }
