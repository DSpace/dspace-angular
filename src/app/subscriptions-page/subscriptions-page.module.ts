import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionsPageComponent } from './subscriptions-page.component';
import { SubscriptionsModule } from '../shared/subscriptions/subscriptions.module';

@NgModule({
    imports: [
        CommonModule,
        SubscriptionsModule,
        SubscriptionsPageComponent
    ]
})
export class SubscriptionsPageModule { }
