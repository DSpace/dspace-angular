import {
  NgFor,
  NgIf,
  TitleCasePipe,
} from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

import { ObjNgFor } from '../../shared/utils/object-ngfor.pipe';
import { HealthResponse } from '../models/health-component.model';
import { HealthComponentComponent } from './health-component/health-component.component';
import { HealthStatusComponent } from './health-status/health-status.component';

/**
 * Show the health panel
 */
@Component({
  selector: 'ds-health-panel',
  templateUrl: './health-panel.component.html',
  styleUrls: ['./health-panel.component.scss'],
  standalone: true,
  imports: [HealthStatusComponent, NgbAccordionModule, NgFor, NgIf, HealthComponentComponent, TitleCasePipe, ObjNgFor, TranslateModule],
})
export class HealthPanelComponent implements OnInit {

  /**
   * Health endpoint response
   */
  @Input() healthResponse: HealthResponse;

  /**
   * The first active panel id
   */
  activeId: string;

  constructor(private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.activeId = Object.keys(this.healthResponse.components)[0];
  }

  /**
   * Return translated label if exist for the given property
   *
   * @param panelKey
   */
  public getPanelLabel(panelKey: string): string {
    const translationKey = `health-page.section.${panelKey}.title`;
    const translation = this.translate.instant(translationKey);

    return (translation === translationKey) ? panelKey : translation;
  }
}
