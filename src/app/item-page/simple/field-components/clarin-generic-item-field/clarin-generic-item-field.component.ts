import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { isEmpty, isNotUndefined } from '../../../../shared/empty.util';
import { ConfigurationProperty } from '../../../../core/shared/configuration-property.model';
import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { convertMetadataFieldIntoSearchType, getBaseUrl } from '../../../../shared/clarin-shared-util';
import { ConfigurationDataService } from '../../../../core/data/configuration-data.service';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { getFirstSucceededRemoteDataPayload } from '../../../../core/shared/operators';
import { map } from 'rxjs/operators';

export const DOI_METADATA_FIELD = 'dc.identifier.doi';
export const HANDLE_METADATA_FIELD = 'dc.identifier.uri';
const SHOW_HANDLE_AND_DOI_PROPERTY_NAME = 'item-page.show-handle-and-doi';

@Component({
  selector: 'ds-clarin-generic-item-field',
  templateUrl: './clarin-generic-item-field.component.html',
  styleUrls: ['./clarin-generic-item-field.component.scss']
})
export class ClarinGenericItemFieldComponent implements OnInit {

  /**
   * The item to display metadata for
   */
  @Input() item: Item;

  /**
   * Fontawesome v5. icon name with default settings.
   */
  @Input() iconName: string;

  /**
   * For now the specific type could be only 'hyperlink' which redirects to the page from the metadata value.
   */
  @Input() type: string;

  /**
   * Separator string between multiple values of the metadata fields defined
   * @type {string}
   */
  @Input() separator: string;

  /**
   * Fields (schema.element.qualifier) used to render their values.
   */
  @Input() fields: string[];

  /**
   * Label i18n key for the rendered metadata
   */
  @Input() label: string;

  /**
   * Replace character in the metadata value.
   * This input value is array of two elements.
   * The first element is the character to replace and the second element is the character to replace with.
   */
  @Input() replaceCharacter: string[];

  /**
   * UI URL loaded from the server.
   */
  baseUrl = '';

  /**
   * Show or hide the metadata value. The default value is `true`.
   */
  showMetadataValue: BehaviorSubject<boolean> = new BehaviorSubject(true);

  /**
   * Enable or disable showing both the handle and DOI identifiers in the item page. The default value is `false` to
   * show only the DOI identifier if it exists in the Item. If there is no DOI identifier,
   * the handle identifier is shown.
   */
  showHandleAndDOI = 'false';

  constructor(protected dsoNameService: DSONameService,
              protected configurationService: ConfigurationDataService) { }

  async ngOnInit(): Promise<void> {
    await this.assignBaseUrl();
    if (isEmpty(this.separator)) {
      this.separator = ',';
    }

    // Set default replace character
    if (isEmpty(this.replaceCharacter)) {
      this.replaceCharacter = [';', ' '];
    }

    // Do not show metadata value if some conditions are met
    await this.shouldShowMetadataValue();
  }

  /**
   * If the metadata fields has some metadata value - show nothing if the field do not have any value.
   */
  public hasMetadataValue() {
    return isNotUndefined(this.item.firstMetadataValue(this.fields));
  }

  /**
   * The method disable showing the metadata value if one of the following conditions is met:
   * - The metadata value is empty
   * - The metadata field is not allowed to be shown by the configuration
   */
  public async shouldShowMetadataValue() {
    // Do not show metadata value if it is empty
    if (!this.hasMetadataValue()) {
      this.showMetadataValue.next(false);
      return;
    }

    // Do not show DOI and Item Identifier (handle) if it is not allowed by the configuration
    await this.shouldShowBothIdentifiers();
  }

  /**
   * Do not show DOI and Item Identifier (handle) if it is not allowed by the configuration property
   * `item-page.show-handle-and-doi`.
   * @private
   */
  private async shouldShowBothIdentifiers() {
    // If the metadata field is Handle and the Item contains DOI identifier, do not show the handle identifier if the
    // configuration is set to show only the DOI identifier.
    if (this.fields.includes(HANDLE_METADATA_FIELD) && this.item.allMetadata(DOI_METADATA_FIELD)?.length > 0){
      await this.loadShowHandleAndDoiConfiguration();
      if (this.showHandleAndDOI === 'false') {
        this.showMetadataValue.next(false);
      }
    }
  }

  /**
   * Return current metadata value. The metadata field could have more metadata values, often the metadata
   * field has only one metadata value - index is 0, but sometimes it has more values e.g. `Author`.
   * @param index
   */
  public getLinkToSearch(index, value = '') {
    let metadataValue = 'Error: value is empty';
    if (isEmpty(value)) {
      // Get metadata value from the Item's metadata field
      metadataValue = this.getMetadataValue(index);
    } else {
      // The metadata value is passed from the parameter.
      metadataValue = value;
    }

    const searchType = convertMetadataFieldIntoSearchType(this.fields);
    return this.baseUrl + '/search?f.' + encodeURIComponent(searchType) + '=' +
      encodeURIComponent(metadataValue) + ',equals';
  }

  /**
   * If the metadata field has more than 1 value return the value based on the index.
   * @param index of the metadata value
   */
  public getMetadataValue(index) {
    let metadataValue = '';
    if (index === 0) {
      // Return first metadata value.
      return this.item.firstMetadataValue(this.fields);
    }
    // The metadata field has more metadata values - get the actual one
    this.item.allMetadataValues(this.fields)?.forEach((metadataValueArray, arrayIndex) => {
      if (index !== arrayIndex) {
        return metadataValue;
      }
      metadataValue = metadataValueArray;
    });
    return metadataValue;
  }

  /**
   * Load base url from the configuration from the BE.
   */
  async assignBaseUrl() {
    this.baseUrl = await getBaseUrl(this.configurationService)
      .then((baseUrlResponse: ConfigurationProperty) => {
        return baseUrlResponse?.values?.[0];
      });
  }

  /**
   * Load the configuration value for showing both the handle and DOI identifiers
   * @private
   */
  private async loadShowHandleAndDoiConfiguration() {
    // Get the configuration value for showing both the handle and DOI identifiers
    this.showHandleAndDOI = await firstValueFrom(this.configurationService.findByPropertyName(SHOW_HANDLE_AND_DOI_PROPERTY_NAME)
      .pipe(
        getFirstSucceededRemoteDataPayload(),
        map((cfgValues) => cfgValues?.values?.[0])));
  }
}
