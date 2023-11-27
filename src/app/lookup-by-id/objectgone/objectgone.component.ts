import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AlertType } from '../../shared/alert/alert-type';

@Component({
  selector: 'ds-objectgone',
  templateUrl: './objectgone.component.html',
  styleUrls: ['./objectgone.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ObjectGoneComponent {
  /**
   * The AlertType enumeration
   * @type {AlertType}
   */
  public AlertTypeEnum = AlertType;
}
