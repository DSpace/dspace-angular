
import {
  Component,
  Input,
} from '@angular/core';
import { HealthStatus } from '@dspace/core/shared/health-component.model';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Show a health status object
 */
@Component({
  selector: 'ds-health-status',
  templateUrl: './health-status.component.html',
  styleUrls: ['./health-status.component.scss'],
  imports: [
    NgbTooltip,
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
