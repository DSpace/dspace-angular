import {
  NgClass,
  NgIf,
  NgStyle,
} from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Item } from 'src/app/core/shared/item.model';
import { MetadataFieldWrapperComponent } from 'src/app/shared/metadata-field-wrapper/metadata-field-wrapper.component';

@Component({
  selector: 'ds-item-page-cc-license-field',
  templateUrl: './item-page-cc-license-field.component.html',
  standalone: true,
  imports: [NgIf, NgClass, NgStyle, TranslateModule, MetadataFieldWrapperComponent],
})
/**
 * Displays the item's Creative Commons license image in it's simple item page
 */
export class ItemPageCcLicenseFieldComponent implements OnInit {
  /**
   * The item to display the CC license image for
   */
  @Input() item: Item;

  /**
   * 'full' variant shows image, a disclaimer (optional) and name (always), better for the item page content.
   * 'small' variant shows image and name (optional), better for the item page sidebar
   */
  @Input() variant?: 'small' | 'full' = 'small';

  /**
   * Filed name containing the CC license URI, as configured in the back-end, in the 'dspace.cfg' file, propertie
   * 'cc.license.uri'
   */
  @Input() ccLicenseUriField? = 'dc.rights.uri';

  /**
   * Filed name containing the CC license name, as configured in the back-end, in the 'dspace.cfg' file, propertie
   * 'cc.license.name'
   */
  @Input() ccLicenseNameField? = 'dc.rights';

  /**
   * Shows the CC license name with the image. Always show if image fails to load
   */
  @Input() showName? = true;

  /**
   * Shows the disclaimer in the 'full' variant of the component
   */
  @Input() showDisclaimer? = true;

  uri: string;
  name: string;
  showImage = true;
  imgSrc: string;

  ngOnInit() {
    this.uri = this.item.firstMetadataValue(this.ccLicenseUriField);
    this.name = this.item.firstMetadataValue(this.ccLicenseNameField);

    // Extracts the CC license code from the URI
    const regex = /.*creativecommons.org\/(licenses|publicdomain)\/([^/]+)/gm;
    const matches = regex.exec(this.uri ?? '') ?? [];
    const ccCode = matches.length > 2 ? matches[2] : null;
    this.imgSrc = ccCode ? `assets/images/cc-licenses/${ccCode}.png` : null;
  }
}
