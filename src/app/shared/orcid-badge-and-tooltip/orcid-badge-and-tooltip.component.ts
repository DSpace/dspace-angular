import { NgClass } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { MetadataValue } from '../../core/shared/metadata.models';

/**
 * Component to display an ORCID badge with a tooltip.
 * The tooltip text changes based on whether the ORCID is authenticated.
 */
@Component({
  selector: 'ds-orcid-badge-and-tooltip',
  standalone: true,
  imports: [
    NgbTooltipModule,
    NgClass,
  ],
  templateUrl: './orcid-badge-and-tooltip.component.html',
  styleUrl: './orcid-badge-and-tooltip.component.scss',
})
export class OrcidBadgeAndTooltipComponent implements OnInit {

  /**
   * The ORCID value to be displayed.
   */
  @Input() orcid: MetadataValue;

  /**
   * The timestamp indicating when the ORCID was authenticated.
   */
  @Input() authenticatedTimestamp: MetadataValue;

  /**
   * The tooltip text to be displayed.
   */
  orcidTooltip: string;

  /**
   * Constructor to inject the TranslateService.
   * @param translateService - Service for translation.
   */
  constructor(
    private translateService: TranslateService,
  ) { }

  /**
   * Initializes the component.
   * Sets the tooltip text based on the presence of the authenticated timestamp.
   */
  ngOnInit() {
    this.orcidTooltip = this.authenticatedTimestamp ?
      this.translateService.instant('person.orcid-tooltip.authenticated', { orcid: this.orcid.value }) :
      this.translateService.instant('person.orcid-tooltip.not-authenticated', { orcid: this.orcid.value });
  }

}
