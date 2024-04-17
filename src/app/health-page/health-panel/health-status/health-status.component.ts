import {
  NgSwitch,
  NgSwitchCase,
} from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCheckCircle,
  faExclamationTriangle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { HealthStatus } from '../../models/health-component.model';

/**
 * Show a health status object
 */
@Component({
  selector: 'ds-health-status',
  templateUrl: './health-status.component.html',
  styleUrls: ['./health-status.component.scss'],
  standalone: true,
  imports: [NgSwitch, NgSwitchCase, NgbTooltipModule, TranslateModule, FontAwesomeModule],
})
export class HealthStatusComponent {
  protected readonly faCheckCircle = faCheckCircle;
  protected readonly faExclamationTriangle = faExclamationTriangle;
  protected readonly faTimesCircle = faTimesCircle;

  /**
   * The current status to show
   */
  @Input() status: HealthStatus;

  /**
   * Health Status
   */
  HealthStatus = HealthStatus;
}
