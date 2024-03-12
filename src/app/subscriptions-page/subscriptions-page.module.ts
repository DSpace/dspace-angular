import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SubscriptionsModule } from '../shared/subscriptions/subscriptions.module';
import { SubscriptionsPageComponent } from './subscriptions-page.component';

@NgModule({
    imports: [
        CommonModule,
        SubscriptionsModule,
        SubscriptionsPageComponent
    ],
})
export class SubscriptionsPageModule { }
