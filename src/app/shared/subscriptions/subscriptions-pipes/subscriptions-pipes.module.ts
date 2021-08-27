import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParseSubscriptionsPipe } from './parse-subscriptions.pipe';

const pipes = [
  ParseSubscriptionsPipe,
];

@NgModule({
  declarations: pipes,
  imports: [
    CommonModule,
  ],
  exports : pipes
})
export class SubscriptionsPipesPageModule { }
