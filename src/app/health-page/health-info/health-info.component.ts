import { TitleCasePipe } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { ObjNgFor } from '../../shared/utils/object-ngfor.pipe';
import { HealthStatusComponent } from '../health-panel/health-status/health-status.component';
import { HealthInfoResponse } from '../models/health-component.model';
import { HealthInfoComponentComponent } from './health-info-component/health-info-component.component';

/**
 * A component to render a "health-info component" object.
 *
 * Note that the word "component" in "health-info component" doesn't refer to Angular use of the term
 * but rather to the components used in the response of the health endpoint of Spring's Actuator
 * API.
 */
@Component({
  selector: 'ds-health-info',
  templateUrl: './health-info.component.html',
  styleUrls: ['./health-info.component.scss'],
  standalone: true,
  imports: [
    HealthInfoComponentComponent,
    HealthStatusComponent,
    NgbAccordionModule,
    ObjNgFor,
    TitleCasePipe,
  ],
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
   * @param panelKey
   */
  public getPanelLabel(panelKey: string): string {
    const translationKey = `health-page.section-info.${panelKey}.title`;
    const translation = this.translate.instant(translationKey);

    return (translation === translationKey) ? panelKey : translation;
  }
}
