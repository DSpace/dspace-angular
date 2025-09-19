
import {
  Component,
  Input,
} from '@angular/core';
import { HealthStatus } from '@dspace/core/shared/health-component.model';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

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
