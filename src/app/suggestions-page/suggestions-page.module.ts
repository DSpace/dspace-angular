import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuggestionsPageComponent } from './suggestions-page.component';
import { SharedModule } from '../shared/shared.module';
import { SuggestionsPageRoutingModule } from './suggestions-page-routing.module';
import { SuggestionsService } from '../suggestion-notifications/reciter-suggestions/suggestions.service';
import { SuggestionNotificationsModule } from '../suggestion-notifications/suggestion-notifications.module';
import { SuggestionsDataService } from '../core/suggestion-notifications/reciter-suggestions/suggestions-data.service';

@NgModule({
  declarations: [SuggestionsPageComponent],
  imports: [
    CommonModule,
    SharedModule,
    SuggestionNotificationsModule,
    SuggestionsPageRoutingModule
  ],
  providers: [
    SuggestionsDataService,
    SuggestionsService
  ]
})
export class SuggestionsPageModule { }
