import {
  AsyncPipe,
  NgClass,
  NgStyle,
} from '@angular/common';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  Observable,
  of,
  Subscription,
} from 'rxjs';
import { ConfigurationDataService } from 'src/app/core/data/configuration-data.service';
import { ConfigurationProperty } from 'src/app/core/shared/configuration-property.model';
import { Item } from 'src/app/core/shared/item.model';
import {
  getFirstCompletedRemoteData,
  getRemoteDataPayload,
} from 'src/app/core/shared/operators';
import { MetadataFieldWrapperComponent } from 'src/app/shared/metadata-field-wrapper/metadata-field-wrapper.component';

@Component({
  selector: 'ds-item-page-cc-license-field',
  templateUrl: './item-page-cc-license-field.component.html',
  standalone: true,
  imports: [AsyncPipe, NgClass, NgStyle, TranslateModule, MetadataFieldWrapperComponent],
})
/**
 * Displays the item's Creative Commons license image in it's simple item page
 */
export class ItemPageCcLicenseFieldComponent implements OnInit, OnDestroy {

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
   * Field name containing the CC license URI
   */
  @Input() ccLicenseUriField?;

  /**
   * Field name containing the CC license name
   */
  @Input() ccLicenseNameField?;

  /**
   * Shows the CC license name with the image. Always show if image fails to load
   */
  @Input() showName? = true;

  /**
   * Shows the disclaimer in the 'full' variant of the component
   */
  @Input() showDisclaimer? = true;


  subscriptions: Subscription[] = [];
  showImage = true;

  uri$: Observable<string>;
  name$: Observable<string>;
  imgSrc$: Observable<string>;

  constructor(
    protected configService: ConfigurationDataService,
  ) {
  }

  /**
   * Parse a URI an return its CC code. URIs pointing to non-CC licenses will return null.
   * @param uri
   * @returns the CC code or null if uri is not a valid CC URI
   */
  public static parseCcCode(uri: string): string {
    const regex = /.*creativecommons.org\/(licenses|publicdomain)\/([^/]+)/gm;
    const matches = regex.exec(uri ?? '') ?? [];
    return matches.length > 2 ? matches[2] : null;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  ngOnInit() {
    this.subscriptions.push(this.configService.findByPropertyName('cc.license.uri').pipe(
      getFirstCompletedRemoteData(),
      getRemoteDataPayload(),
    ).subscribe((remoteData: ConfigurationProperty) => {
      if (this.ccLicenseUriField === undefined) {
        // Set the value only if it has not manually set when declaring this component
        this.ccLicenseUriField = remoteData?.values && remoteData?.values?.length > 0 ? remoteData.values[0] : 'dc.rights.uri';
      }
      const uri = this.item.firstMetadataValue(this.ccLicenseUriField);
      const ccCode = ItemPageCcLicenseFieldComponent.parseCcCode(uri);
      this.uri$ = of(uri);
      this.imgSrc$ = of(ccCode ? `assets/images/cc-licenses/${ccCode}.png` : null);
    }),
    );

    this.subscriptions.push(this.configService.findByPropertyName('cc.license.name').pipe(
      getFirstCompletedRemoteData(),
      getRemoteDataPayload(),
    ).subscribe((remoteData: ConfigurationProperty) => {
      if (this.ccLicenseNameField === undefined) {
        // Set the value only if it has not manually set when declaring this component
        this.ccLicenseNameField = remoteData?.values && remoteData?.values?.length > 0 ? remoteData.values[0] : 'dc.rights';
      }
      this.name$ = of(this.item.firstMetadataValue(this.ccLicenseNameField));
    }),
    );
  }
}
