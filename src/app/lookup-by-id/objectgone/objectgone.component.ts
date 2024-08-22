import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';

import { AlertType } from '../../shared/alert/alert-type';
import { AlertComponent } from '../../shared/alert/alert.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ds-base-objectgone',
  templateUrl: './objectgone.component.html',
  styleUrls: ['./objectgone.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [
    AlertComponent,
    TranslateModule,
    RouterLink
  ]
})
export class ObjectGoneComponent {
  /**
   * The AlertType enumeration
   * @type {AlertType}
   */
  public AlertTypeEnum = AlertType;
}
