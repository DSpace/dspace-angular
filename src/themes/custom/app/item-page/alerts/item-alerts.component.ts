import { Component } from '@angular/core';
import { ItemAlertsComponent as BaseComponent } from '../../../../../app/item-page/alerts/item-alerts.component';
import { AlertComponent } from '../../../../../app/shared/alert/alert.component';
import { AsyncPipe, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ds-item-alerts',
  // templateUrl: './item-alerts.component.html',
  templateUrl: '../../../../../app/item-page/alerts/item-alerts.component.html',
  // styleUrls: ['./item-alerts.component.scss'],
  styleUrls: ['../../../../../app/item-page/alerts/item-alerts.component.scss'],
  standalone: true,
  imports: [
    AlertComponent,
    NgIf,
    TranslateModule,
    RouterLink,
    AsyncPipe
  ],
})
export class ItemAlertsComponent extends BaseComponent {
}
