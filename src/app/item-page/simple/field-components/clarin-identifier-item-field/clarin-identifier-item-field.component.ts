import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { ConfigurationDataService } from '../../../../core/data/configuration-data.service';
import { getFirstSucceededRemoteDataPayload } from '../../../../core/shared/operators';
import { map } from 'rxjs/operators';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { Clipboard } from '@angular/cdk/clipboard';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

const SHOW_HANDLE_AND_DOI_PROPERTY_NAME = 'item-page.show-handle-and-doi';
const DOI_METADATA_FIELD = 'dc.identifier.doi';
const HANDLE_METADATA_FIELD = 'dc.identifier.uri';

@Component({
  selector: 'ds-clarin-identifier-item-field',
  templateUrl: './clarin-identifier-item-field.component.html',
  styleUrls: ['./clarin-identifier-item-field.component.scss']
})
export class ClarinIdentifierItemFieldComponent implements OnInit {

  /**
   * After clicking on the `Copy` icon the message `Copied` is popped up.
   */
  @ViewChild('copyButton', {static: false}) copyButtonRef: NgbTooltip;

  /**
   * The item to display metadata for
   */
  @Input() item: Item;

  /**
   * Fields (schema.element.qualifier) used to render their values.
   */
  @Input() fields: string[];

  /**
   * Enable or disable showing both the handle and DOI identifiers in the item page. The default value is `false` to
   * show only the DOI identifier if it exists in the Item. If there is no DOI identifier,
   * the handle identifier is shown.
   */
  showHandleAndDOI = 'false';

  /**
   * The identifiers to display (DOI and/or handle)
   */
  identifiers: BehaviorSubject<string[]> = new BehaviorSubject(['']);

  constructor(private configurationService: ConfigurationDataService,
              private clipboard: Clipboard) {
  }

  async ngOnInit(): Promise<void> {
    // Get the configuration value for showing both the handle and DOI identifiers
    this.showHandleAndDOI = await firstValueFrom(this.configurationService.findByPropertyName(SHOW_HANDLE_AND_DOI_PROPERTY_NAME)
      .pipe(
        getFirstSucceededRemoteDataPayload(),
        map((cfgValues) => cfgValues?.values?.[0])));

    // Set the identifiers to display
    this.setIdentifiersToDisplay();
  }

  private setIdentifiersToDisplay() {
    let tempIdentifiers: string[] = [];
    const containsDOI = this.item.allMetadata(DOI_METADATA_FIELD)?.length > 0;
    this.fields?.forEach(field => {
      // Show handle identifier if there is DOI identifier in the Item and the configuration is set to show both
      if (field === HANDLE_METADATA_FIELD) {
        if (containsDOI && this.showHandleAndDOI === 'true') {
          tempIdentifiers.push(...this.item.allMetadataValues(HANDLE_METADATA_FIELD));
        } else if (!containsDOI) {
          tempIdentifiers.push(...this.item.allMetadataValues(HANDLE_METADATA_FIELD));
        }
      }
      // Every time show DOI identifier if it exists in the Item
      if (field === DOI_METADATA_FIELD) {
        tempIdentifiers.push(...this.item.allMetadataValues(DOI_METADATA_FIELD));
      }
    });
    this.identifiers.next(tempIdentifiers);
  }

  /**
   * Copy the metadata value to the clipboard. After clicking on the `Copy` icon the message `Copied` is popped up.
   *
   * @param value
   */
  copyToClipboard(value: string) {
    this.clipboard.copy(value);
    setTimeout(() => {
      this.copyButtonRef.close();
    }, 700);
  }
}
