import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { SuggestionsDataService } from '../core/notifications/suggestions-data.service';
import { SuggestionsService } from '../notifications/suggestions.service';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        CommonModule,
        NotificationsModule,
        TranslateModule
    ],
  providers: [
    SuggestionsDataService,
    SuggestionsService
  ]
})
export class SuggestionsPageModule { }
