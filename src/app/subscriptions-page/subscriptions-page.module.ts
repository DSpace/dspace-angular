import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { SubscriptionsModule } from '../shared/subscriptions/subscriptions.module';
import { SubscriptionsPageComponent } from './subscriptions-page.component';

@NgModule({
  declarations: [SubscriptionsPageComponent],
  imports: [
    CommonModule,
    SharedModule,
    SubscriptionsModule,
  ],
})
export class SubscriptionsPageModule { }
