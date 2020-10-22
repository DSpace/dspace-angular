import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuggestionPageComponent } from './suggestion-page.component';
import { SharedModule } from '../shared/shared.module';
import { SuggestionPageRoutingModule } from './suggestion-page-routing.module';
import { SuggestionTargetsService } from '../openaire/reciter/suggestion-target/suggestion-target.service';
import { SuggestionTargetRestService } from '../core/reciter-suggestions/reciter-suggestions-rest.service';

@NgModule({
  declarations: [SuggestionPageComponent],
  imports: [
    CommonModule,
    SharedModule,
    SuggestionPageRoutingModule
  ],
  providers: [
    SuggestionTargetRestService,
    SuggestionTargetsService
  ]
})
export class SuggestionPageModule { }
