import { Component, Input, OnInit } from '@angular/core';

import { HealthInfoResponse } from '../models/health-component.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ds-health-info',
  templateUrl: './health-info.component.html',
  styleUrls: ['./health-info.component.scss']
})
export class HealthInfoComponent implements OnInit  {

  @Input() healthInfoResponse: HealthInfoResponse;

  /**
   * The first active panel id
   */
  activeId: string;

  constructor(private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.activeId = Object.keys(this.healthInfoResponse)[0];
  }
  /**
   * Return translated label if exist for the given property
   *
   * @param property
   */
  public getPanelLabel(panelKey: string): string {
    const translationKey = `health-page.section-info.${panelKey}.title`;
    const translation = this.translate.instant(translationKey);

    return (translation === translationKey) ? panelKey : translation;
  }
}
