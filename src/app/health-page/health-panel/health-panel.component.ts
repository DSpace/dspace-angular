import { Component, Input } from '@angular/core';
import { HealthResponse } from '../models/health-component.model';

@Component({
  selector: 'ds-health-panel',
  templateUrl: './health-panel.component.html',
  styleUrls: ['./health-panel.component.scss']
})
export class HealthPanelComponent {

  /**
   * Health endpoint response
   */
  @Input() healthResponse: HealthResponse;

  /**
   * A boolean representing if div should start collapsed
   */
  public isCollapsed = true;

}
