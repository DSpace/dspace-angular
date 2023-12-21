import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuggestionsPageComponent } from './suggestions-page.component';
import { SharedModule } from '../shared/shared.module';
import { SuggestionsPageRoutingModule } from './suggestions-page-routing.module';
import { SuggestionsService } from '../suggestion-notifications/reciter-suggestions/suggestions.service';
import { SuggestionsDataService } from '../core/suggestion-notifications/reciter-suggestions/suggestions-data.service';
import { NotificationsModule } from '../notifications/notifications.module';

@NgModule({
  declarations: [SuggestionsPageComponent],
  imports: [
    CommonModule,
    SharedModule,
    SuggestionsPageRoutingModule,
    NotificationsModule
  ],
  providers: [
    SuggestionsDataService,
    SuggestionsService
  ]
})
export class SuggestionsPageModule { }
