import { Component, Input } from '@angular/core';

import { HealthInfoComponent } from '../../models/health-component.model';

@Component({
  selector: 'ds-health-info-component',
  templateUrl: './health-info-component.component.html',
  styleUrls: ['./health-info-component.component.scss']
})
export class HealthInfoComponentComponent {

  /**
   * The HealthInfoComponent object to display
   */
  @Input() healthInfoComponent: HealthInfoComponent|string;

  /**
   * The HealthInfoComponent object name
   */
  @Input() healthInfoComponentName: string;

  /**
   * A boolean representing if div should start collapsed
   */
  @Input() isNested = false;

  /**
   * A boolean representing if div should start collapsed
   */
  public isCollapsed = true;

  isPlainProperty(entry: HealthInfoComponent | string): boolean {
    return typeof entry === 'string';
  }
}
