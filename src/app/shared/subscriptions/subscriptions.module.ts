import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { SubscriptionModalComponent } from './subscription-modal/subscription-modal.component';
import { SubscriptionViewComponent } from './subscription-view/subscription-view.component';

const COMPONENTS = [
  SubscriptionViewComponent,
  SubscriptionModalComponent,
];

@NgModule({
    imports: [
        CommonModule,
        NgbModalModule,
        ReactiveFormsModule,
        TranslateModule,
        RouterModule,
        ...COMPONENTS
    ],
    exports: [
    ...COMPONENTS,
  ],
})
export class SubscriptionsModule {
}
