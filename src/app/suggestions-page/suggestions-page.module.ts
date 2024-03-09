import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SuggestionsDataService } from '../core/notifications/suggestions-data.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { SuggestionsService } from '../notifications/suggestions.service';
import { SharedModule } from '../shared/shared.module';
import { SuggestionsPageComponent } from './suggestions-page.component';
import { SuggestionsPageRoutingModule } from './suggestions-page-routing.module';

@NgModule({
  declarations: [SuggestionsPageComponent],
  imports: [
    CommonModule,
    SharedModule,
    SuggestionsPageRoutingModule,
    NotificationsModule,
  ],
  providers: [
    SuggestionsDataService,
    SuggestionsService,
  ],
})
export class SuggestionsPageModule { }
