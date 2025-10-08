import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import {
  combineLatest,
  map,
  Observable,
} from 'rxjs';

import { BrowseService } from '../../../../../core/browse/browse.service';
import { BrowseDefinitionDataService } from '../../../../../core/browse/browse-definition-data.service';
import { ConfigurationDataService } from '../../../../../core/data/configuration-data.service';
import { ConfigurationProperty } from '../../../../../core/shared/configuration-property.model';
import { Item } from '../../../../../core/shared/item.model';
import { MetadataValue } from '../../../../../core/shared/metadata.models';
import { getFirstSucceededRemoteDataPayload } from '../../../../../core/shared/operators';
import { ImageField } from '../image-field';
import { ItemPageFieldComponent } from '../item-page-field.component';

@Component({
  selector: 'ds-item-page-orcid-field',
  templateUrl: './item-page-orcid-field.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    TranslatePipe,
  ],
})
/**
 * This component is used for displaying ORCID identifier as a clickable link
 */
export class ItemPageOrcidFieldComponent extends ItemPageFieldComponent implements OnInit {

  /**
   * The item to display metadata for
   */
  @Input() item: Item;

  /**
   * Separator string between multiple values of the metadata fields defined
   * @type {string}
   */
  separator: string;

  /**
   * Fields (schema.element.qualifier) used to render their values.
   * In this component, we want to display values for metadata 'person.identifier.orcid'
   */
  fields: string[] = [
    'person.identifier.orcid',
  ];

  /**
   * Label i18n key for the rendered metadata
   */
  label = 'item.page.orcid-profile';

  /**
   * Observable for the ORCID URL from configuration
   */
  baseUrl$: Observable<string>;

  /**
   * ORCID ID (without full URL)
   */
  orcidId: string | null;

  /**
   * Observable for the full ORCID URL
   */
  orcidUrl$: Observable<string>;

  /**
   * Whether the item has ORCID metadata
   */
  hasOrcidMetadata: boolean;

  /**
   * ORCID icon configuration
   */
  img: ImageField = {
    URI: 'assets/images/orcid.logo.icon.svg',
    alt: 'item.page.orcid-icon',
    heightVar: '--ds-orcid-icon-height',
  };

  /**
   * Creates an instance of ItemPageOrcidFieldComponent.
   *
   * @param {BrowseDefinitionDataService} browseDefinitionDataService - Service for managing browse definitions
   * @param {BrowseService} browseService - Service for browse functionality
   * @param {ConfigurationDataService} configurationService - Service for accessing configuration properties
   */
  constructor(
    protected browseDefinitionDataService: BrowseDefinitionDataService,
    protected browseService: BrowseService,
    protected configurationService: ConfigurationDataService,
  ) {
    super(browseDefinitionDataService, browseService);
  }

  /**
   * Initializes the component and sets up observables for ORCID URL.
   * Separates the display value (ORCID ID) from the link URL.
   *
   * @returns {void}
   */
  ngOnInit(): void {

    this.hasOrcidMetadata = this.hasOrcid();

    this.baseUrl$ = this.configurationService
      .findByPropertyName('orcid.domain-url')
      .pipe(
        getFirstSucceededRemoteDataPayload(),
        map((property: ConfigurationProperty) =>
          property?.values?.length > 0 ? property.values[0] : null,
        ),
      );

    const metadata = this.getOrcidMetadata();

    this.orcidId = metadata?.value.replace(/^\//, '') || null;

    this.orcidUrl$ = combineLatest([
      this.baseUrl$,
    ]).pipe(
      map(([baseUrl]) => {
        if (!baseUrl || !this.orcidId) {
          return null;
        }

        const cleanBaseUrl = baseUrl.replace(/\/$/, '');
        return `${cleanBaseUrl}/${this.orcidId}`;
      }),
    );
  }

  /**
   * Retrieves the ORCID metadata value from the item.
   * Extracts the first ORCID identifier from the item's metadata fields,
   * ensuring the value is not empty or whitespace only.
   *
   * @private
   * @returns {MetadataValue | null} The ORCID metadata value if found and valid, null otherwise
   */
  private getOrcidMetadata(): MetadataValue | null {
    if (!this.item || !this.hasOrcid()) {
      return null;
    }

    const metadata = this.item.findMetadataSortedByPlace('person.identifier.orcid');
    return metadata.length > 0 && metadata[0].value?.trim() ? metadata[0] : null;
  }

  /**
   * Checks whether the item has ORCID metadata associated with it.
   *
   * @public
   * @returns {boolean} True if the item has 'person.identifier.orcid' metadata, false otherwise
   */
  public hasOrcid(): boolean {
    return this.item?.hasMetadata('person.identifier.orcid');
  }
}
