import { Component, Input } from '@angular/core';

import { PermittedVersions } from '../../../../core/submission/models/sherpa-policies-details.model';

@Component({
  selector: 'ds-content-accordion',
  templateUrl: './content-accordion.component.html',
  styleUrls: ['./content-accordion.component.scss']
})
export class ContentAccordionComponent {
  /**
   * PermittedVersions to show information from
   */
  @Input() version: PermittedVersions;

  /**
   * A boolean representing if div should start collapsed
   */
  public isCollapsed = false;
}
