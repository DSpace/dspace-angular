import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuggestionsPageRoutingModule } from './suggestions-page-routing.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { SuggestionsDataService } from '../core/notifications/suggestions-data.service';
import { SuggestionsService } from '../notifications/suggestions.service';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        SuggestionsPageRoutingModule,
        NotificationsModule,
        TranslateModule
    ],
  providers: [
    SuggestionsDataService,
    SuggestionsService
  ]
})
export class SuggestionsPageModule { }
