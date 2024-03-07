import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { isEmpty, isNotUndefined } from '../../../../shared/empty.util';
import { ConfigurationProperty } from '../../../../core/shared/configuration-property.model';
import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { convertMetadataFieldIntoSearchType, getBaseUrl } from '../../../../shared/clarin-shared-util';
import { ConfigurationDataService } from '../../../../core/data/configuration-data.service';

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


  // tslint:disable-next-line:no-empty
  constructor(protected dsoNameService: DSONameService,
              protected configurationService: ConfigurationDataService) { }

  // tslint:disable-next-line:no-empty
  async ngOnInit(): Promise<void> {
    await this.assignBaseUrl();
    if (isEmpty(this.separator)) {
      this.separator = ',';
    }

    // Set default replace character
    if (isEmpty(this.replaceCharacter)) {
      this.replaceCharacter = [';', ' '];
    }
  }

  /**
   * If the metadata fields has some metadata value - show nothing if the field do not have any value.
   */
  public hasMetadataValue() {
    return isNotUndefined(this.item.firstMetadataValue(this.fields));
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
    return this.baseUrl + '/search?f.' + searchType + '=' + metadataValue + ',equals';
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
}
