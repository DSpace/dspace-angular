import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionsPageComponent } from './subscriptions-page.component';
import { SharedModule } from '../shared/shared.module';
import { SubscriptionsPipesPageModule } from '../shared/subscriptions/subscriptions-pipes/subscriptions-pipes.module';

@NgModule({
  declarations: [SubscriptionsPageComponent],
  imports: [
    CommonModule,
    SharedModule,
    SubscriptionsPipesPageModule
  ]
})
export class SubscriptionsPageModule { }
