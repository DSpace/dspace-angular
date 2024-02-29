import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuggestionsPageComponent } from './suggestions-page.component';
import { SharedModule } from '../shared/shared.module';
import { SuggestionsPageRoutingModule } from './suggestions-page-routing.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { SuggestionsDataService } from '../core/notifications/suggestions-data.service';
import { SuggestionsService } from '../notifications/suggestions.service';

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
