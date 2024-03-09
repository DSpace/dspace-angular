import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SubscriptionsPageComponent } from './subscriptions-page.component';
import { SubscriptionsPageModule } from './subscriptions-page.module';


@NgModule({
  imports: [
    SubscriptionsPageModule,
    RouterModule.forChild([
      {
        path: '',
        data: {
          title: 'subscriptions.title',
        },
        children: [
          {
            path: '',
            component: SubscriptionsPageComponent,
          },
        ],
      },
    ]),
  ],
})
export class SubscriptionsPageRoutingModule {
}
