import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuggestionsPageComponent } from './suggestions-page.component';
import { SharedModule } from '../shared/shared.module';
import { SuggestionsPageRoutingModule } from './suggestions-page-routing.module';
import { SuggestionsService } from '../suggestion-notifications/reciter-suggestions/suggestions.service';
import { OpenaireSuggestionsDataService } from '../core/suggestion-notifications/reciter-suggestions/openaire-suggestions-data.service';
import {SuggestionNotificationsModule} from '../suggestion-notifications/suggestion-notifications.module';

@NgModule({
  declarations: [SuggestionsPageComponent],
  imports: [
    CommonModule,
    SharedModule,
    SuggestionNotificationsModule,
    SuggestionsPageRoutingModule
  ],
  providers: [
    OpenaireSuggestionsDataService,
    SuggestionsService
  ]
})
export class SuggestionsPageModule { }
