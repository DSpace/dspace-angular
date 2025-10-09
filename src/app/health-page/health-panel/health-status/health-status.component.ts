
import {
  Component,
  Input,
} from '@angular/core';
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
  imports: [
    NgbTooltipModule,
    TranslateModule,
  ],
})
export class HealthStatusComponent {
  /**
   * The current status to show
   */
  @Input() status: HealthStatus;

  /**
   * Health Status
   */
  HealthStatus = HealthStatus;

}
