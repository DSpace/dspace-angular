import { Component, Input } from '@angular/core';
import { HealthStatus } from '../../models/health-component.model';
import { TranslateModule } from '@ngx-translate/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSwitch, NgSwitchCase } from '@angular/common';

/**
 * Show a health status object
 */
@Component({
    selector: 'ds-health-status',
    templateUrl: './health-status.component.html',
    styleUrls: ['./health-status.component.scss'],
    standalone: true,
    imports: [NgSwitch, NgSwitchCase, NgbTooltipModule, TranslateModule]
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
