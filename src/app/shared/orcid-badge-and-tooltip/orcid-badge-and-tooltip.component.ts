import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import {
  map,
  Observable,
  of,
} from 'rxjs';

import { ConfigurationDataService } from '../../core/data/configuration-data.service';
import { MetadataValue } from '../../core/shared/metadata.models';

@Component({
  selector: 'ds-orcid-badge-and-tooltip',
  standalone: true,
  imports: [
    AsyncPipe,
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
   * Observable for the full ORCID URL
   */
  orcidUrl$: Observable<string>;

  constructor(
    private translateService: TranslateService,
    private configurationService: ConfigurationDataService,
  ) { }

  ngOnInit() {
    this.orcidTooltip = this.authenticatedTimestamp ?
      this.translateService.instant('person.orcid-tooltip.authenticated', { orcid: this.orcid.value }) :
      this.translateService.instant('person.orcid-tooltip.not-authenticated', { orcid: this.orcid.value });

    this.orcidUrl$ = this.buildOrcidUrl();
  }

  /**
   * Build the full ORCID URL from configuration and metadata value
   */
  private buildOrcidUrl(): Observable<string> {
    // TODO: Remove this mock and uncomment the real implementation below
    const baseUrl$ = of('https://sandbox.orcid.org');

    /* Real implementation - uncomment when configuration is exposed:
    const baseUrl$ = this.configurationService
      .findByPropertyName('orcid.domain-url')
      .pipe(
        getFirstSucceededRemoteDataPayload(),
        map((property: ConfigurationProperty) =>
          property?.values?.length > 0 ? property.values[0] : null,
        ),
      );
    */

    return baseUrl$.pipe(
      map(baseUrl => {
        if (!baseUrl || !this.orcid?.value) {
          return '';
        }

        const cleanBaseUrl = baseUrl.replace(/\/$/, '');
        const cleanOrcidId = this.orcid.value.replace(/^\//, '');
        return `${cleanBaseUrl}/${cleanOrcidId}`;
      }),
    );
  }
}
