import { Component, Input } from '@angular/core';

import { HealthComponent } from '../../models/health-component.model';

@Component({
  selector: 'ds-health-component',
  templateUrl: './health-component.component.html',
  styleUrls: ['./health-component.component.scss']
})
export class HealthComponentComponent {

  /**
   * The HealthComponent object to display
   */
  @Input() healthComponent: HealthComponent;

  /**
   * The HealthComponent object name
   */
  @Input() healthComponentName: string;

  /**
   * A boolean representing if div should start collapsed
   */
  public isCollapsed = true;

}
