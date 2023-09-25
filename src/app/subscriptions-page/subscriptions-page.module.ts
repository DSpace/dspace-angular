import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionsPageComponent } from './subscriptions-page.component';
import { SharedModule } from '../shared/shared.module';
import { SubscriptionsModule } from '../shared/subscriptions/subscriptions.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        SubscriptionsModule,
        SubscriptionsPageComponent
    ]
})
export class SubscriptionsPageModule { }
