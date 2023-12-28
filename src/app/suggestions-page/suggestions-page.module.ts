import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuggestionsPageComponent } from './suggestions-page.component';
import { SharedModule } from '../shared/shared.module';
import { SuggestionsPageRoutingModule } from './suggestions-page-routing.module';
import { NotificationsModule } from '../notifications/notifications.module';

@NgModule({
  declarations: [SuggestionsPageComponent],
  imports: [
    CommonModule,
    SharedModule,
    NotificationsModule,
    SuggestionsPageRoutingModule
  ]
})
export class SuggestionsPageModule { }
