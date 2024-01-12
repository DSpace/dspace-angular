import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuggestionsPageComponent } from './suggestions-page.component';
import { SharedModule } from '../shared/shared.module';
import { SuggestionsPageRoutingModule } from './suggestions-page-routing.module';
import { SuggestionsService } from '../notifications/reciter-suggestions/suggestions.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { SuggestionsDataService } from '../core/notifications/reciter-suggestions/suggestions-data.service';

@NgModule({
  declarations: [SuggestionsPageComponent],
  imports: [
    CommonModule,
    SharedModule,
    NotificationsModule,
    SuggestionsPageRoutingModule
  ],
  providers: [
    SuggestionsDataService,
    SuggestionsService
  ]
})
export class SuggestionsPageModule { }
