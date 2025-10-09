import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ItemAlertsComponent as BaseComponent } from '../../../../../app/item-page/alerts/item-alerts.component';
import { AlertComponent } from '../../../../../app/shared/alert/alert.component';

@Component({
  selector: 'ds-themed-item-alerts',
  // templateUrl: './item-alerts.component.html',
  templateUrl: '../../../../../app/item-page/alerts/item-alerts.component.html',
  // styleUrls: ['./item-alerts.component.scss'],
  styleUrls: ['../../../../../app/item-page/alerts/item-alerts.component.scss'],
  standalone: true,
  imports: [
    AlertComponent,
    AsyncPipe,
    RouterLink,
    TranslateModule,
  ],
})
export class ItemAlertsComponent extends BaseComponent {
}
