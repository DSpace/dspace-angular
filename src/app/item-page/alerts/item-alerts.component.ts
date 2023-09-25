import { Component, Input } from '@angular/core';
import { Item } from '../../core/shared/item.model';
import { AlertType } from '../../shared/alert/alert-type';
import { AlertComponent } from '../../shared/alert/alert.component';
import { NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ds-item-alerts',
  templateUrl: './item-alerts.component.html',
  styleUrls: ['./item-alerts.component.scss'],
  imports: [
    AlertComponent,
    NgIf,
    TranslateModule,
    RouterLink
  ],
  standalone: true
})
/**
 * Component displaying alerts for an item
 */
export class ItemAlertsComponent {
  /**
   * The Item to display alerts for
   */
  @Input() item: Item;

  /**
   * The AlertType enumeration
   * @type {AlertType}
   */
  public AlertTypeEnum = AlertType;
}
