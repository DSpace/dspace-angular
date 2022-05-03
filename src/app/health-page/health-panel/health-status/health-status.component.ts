import { Component, Input } from '@angular/core';
import { HealthStatus } from '../../models/health-component.model';

@Component({
  selector: 'ds-health-status',
  templateUrl: './health-status.component.html',
  styleUrls: ['./health-status.component.scss']
})
export class HealthStatusComponent {
  /**
   * The current status to show
   */
  @Input() status: HealthStatus;

  /**
   * He
   */
  HealthStatus = HealthStatus;

}
