import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';

import { AlertType } from '../../shared/alert/alert-type';

@Component({
  selector: 'ds-base-objectgone',
  templateUrl: './objectgone.component.html',
  styleUrls: ['./objectgone.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
})
export class ObjectGoneComponent {
  /**
   * The AlertType enumeration
   * @type {AlertType}
   */
  public AlertTypeEnum = AlertType;
}
