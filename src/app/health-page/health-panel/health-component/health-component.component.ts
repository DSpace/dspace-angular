import { Component, Input } from '@angular/core';

import { HealthComponent } from '../../models/health-component.model';
import { TranslateService } from '@ngx-translate/core';

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
  public isCollapsed = false;

  constructor(private translate: TranslateService) {
  }

  /**
   * Return translated label if exist for the given property
   *
   * @param property
   */
  public getPropertyLabel(property: string): string {
    const translationKey = `health-page.property.${property}`;
    const translation = this.translate.instant(translationKey);

    return (translation === translationKey) ? property : translation;
  }
}
