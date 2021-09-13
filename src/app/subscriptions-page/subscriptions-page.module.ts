import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionsPageComponent } from './subscriptions-page.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [SubscriptionsPageComponent],
  imports: [
    CommonModule,
    SharedModule,
  ]
})
export class SubscriptionsPageModule { }
