import {
  NgClass,
  NgIf,
  NgStyle,
} from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ConfigurationDataService } from 'src/app/core/data/configuration-data.service';
import { ConfigurationProperty } from 'src/app/core/shared/configuration-property.model';
import { Item } from 'src/app/core/shared/item.model';
import {
  getFirstCompletedRemoteData,
  getRemoteDataPayload,
} from 'src/app/core/shared/operators';
import { MetadataFieldWrapperComponent } from 'src/app/shared/metadata-field-wrapper/metadata-field-wrapper.component';
import {
  APP_CONFIG,
  AppConfig,
} from 'src/config/app-config.interface';

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
   * Expression used to detect (and parse) whether a URI denotes a CC license
   */
  public static readonly regex = /.*creativecommons.org\/(licenses|publicdomain)\/([^/]+)/gm;

  /**
   * The item to display the CC license image for
   */
  @Input() item: Item;

  /**
   * 'full' variant shows image, a disclaimer (optional) and name (always), better for the item page content.
   * 'small' variant shows image and name (optional), better for the item page sidebar
   */
  @Input() variant?: 'small' | 'full' = this.appConfig.ccLicense.variant;

  /**
   * Field name containing the CC license URI
   */
  @Input() ccLicenseUriField?;

  /**
   * Field name containing the CC license URI
   */
  @Input() ccLicenseNameField?;

  /**
   * Shows the CC license name with the image. Always show if image fails to load
   */
  @Input() showName? = this.appConfig.ccLicense.showName;

  /**
   * Shows the disclaimer in the 'full' variant of the component
   */
  @Input() showDisclaimer? = this.appConfig.ccLicense.showDisclaimer;

  uri: string;
  name: string;
  showImage = true;
  imgSrc: string;

  constructor(
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    protected configService: ConfigurationDataService,
  ) {
  }

  ngOnInit() {

    this.configService.findByPropertyName('cc.license.uri').pipe(
      getFirstCompletedRemoteData(),
      getRemoteDataPayload(),
    ).subscribe((remoteData: ConfigurationProperty) => {
      if (this.ccLicenseUriField === undefined) {
        // Set the value only if it has not manually set when declaring this component
        this.ccLicenseUriField = remoteData?.values && remoteData?.values?.length > 0 ? remoteData.values[0] : 'dc.rights.uri';
      }
      this.uri = this.item.firstMetadataValue(this.ccLicenseUriField);
      // Extract the CC license code from the URI
      const matches = ItemPageCcLicenseFieldComponent.regex.exec(this.uri ?? '') ?? [];
      const ccCode = matches.length > 2 ? matches[2] : null;
      this.imgSrc = ccCode ? `assets/images/cc-licenses/${ccCode}.png` : null;
    });

    this.configService.findByPropertyName('cc.license.name').pipe(
      getFirstCompletedRemoteData(),
      getRemoteDataPayload(),
    ).subscribe((remoteData: ConfigurationProperty) => {
      if (this.ccLicenseNameField === undefined) {
        // Set the value only if it has not manually set when declaring this component
        this.ccLicenseNameField = remoteData?.values && remoteData?.values?.length > 0 ? remoteData.values[0] : 'dc.rights';
      }
      this.name = this.item.firstMetadataValue(this.ccLicenseNameField);
    });
  }
}
