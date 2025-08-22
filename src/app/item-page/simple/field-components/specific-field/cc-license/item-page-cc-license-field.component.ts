import {
  AsyncPipe,
  NgClass,
  NgStyle,
} from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ConfigurationDataService } from '@dspace/core/data/configuration-data.service';
import { ConfigurationProperty } from '@dspace/core/shared/configuration-property.model';
import { Item } from '@dspace/core/shared/item.model';
import {
  getFirstCompletedRemoteData,
  getRemoteDataPayload,
} from '@dspace/core/shared/operators';
import { hasValue } from '@dspace/shared/utils/empty.util';
import { parseCcCode } from '@dspace/shared/utils/license.utils';
import { TranslateModule } from '@ngx-translate/core';
import {
  map,
  Observable,
  of,
} from 'rxjs';
import { MetadataFieldWrapperComponent } from 'src/app/shared/metadata-field-wrapper/metadata-field-wrapper.component';


@Component({
  selector: 'ds-item-page-cc-license-field',
  templateUrl: './item-page-cc-license-field.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    MetadataFieldWrapperComponent,
    NgClass,
    NgStyle,
    TranslateModule,
  ],
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
   * Field name containing the CC license URI
   */
  @Input() ccLicenseUriField?: string;

  /**
   * Field name containing the CC license name
   */
  @Input() ccLicenseNameField?: string;

  /**
   * Shows the CC license name with the image. Always show if image fails to load
   */
  @Input() showName? = true;

  /**
   * Shows the disclaimer in the 'full' variant of the component
   */
  @Input() showDisclaimer? = true;


  showImage = true;

  name$: Observable<string>;
  uri$: Observable<string>;
  imgSrc$: Observable<string>;


  constructor(
    protected configService: ConfigurationDataService,
  ) {
  }

  ngOnInit(): void {
    if (hasValue(this.ccLicenseNameField)) {
      this.name$ = of(this.item.firstMetadataValue(this.ccLicenseNameField));
    } else {
      this.name$ = this.configService.findByPropertyName('cc.license.name').pipe(
        getFirstCompletedRemoteData(),
        getRemoteDataPayload(),
        map((configurationProperty: ConfigurationProperty) => configurationProperty?.values?.[0]),
        map((metadataField: string) => hasValue(metadataField) ? metadataField : 'dc.rights'),
        map((metadataField: string) => this.item.firstMetadataValue(metadataField)),
      );
    }

    if (hasValue(this.ccLicenseUriField)) {
      this.uri$ = of(this.item.firstMetadataValue(this.ccLicenseUriField));
    } else {
      this.uri$ = this.configService.findByPropertyName('cc.license.uri').pipe(
        getFirstCompletedRemoteData(),
        getRemoteDataPayload(),
        map((configurationProperty: ConfigurationProperty) => configurationProperty?.values?.[0]),
        map((metadataField: string) => hasValue(metadataField) ? metadataField : 'dc.rights.uri'),
        map((metadataField: string) => this.item.firstMetadataValue(metadataField)),
      );
    }

    this.imgSrc$ = this.uri$.pipe(
      map((uri: string) => parseCcCode(uri)),
      map((ccCode: string) => ccCode ? `assets/images/cc-licenses/${ccCode}.png` : null),
    );
  }
}
