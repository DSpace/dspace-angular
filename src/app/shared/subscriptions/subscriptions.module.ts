import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SubscriptionViewComponent } from './components/subscription-view/subscription-view.component';
import { SubscriptionModalComponent } from './components/subscription-modal/subscription-modal.component';
import { SubscriptionEditModalComponent } from './components/subscription-edit-modal/subscription-edit-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

const COMPONENTS = [
  SubscriptionViewComponent,
  SubscriptionModalComponent,
  SubscriptionEditModalComponent,
];

@NgModule({
  declarations: [
    ...COMPONENTS
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule
  ],
  exports: [
    ...COMPONENTS
  ]
})
export class SubscriptionsModule { }
