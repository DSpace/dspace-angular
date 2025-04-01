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
  ViewContainerRef,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  map,
  Observable,
  of,
  Subscription,
} from 'rxjs';
import { ConfigurationDataService } from 'src/app/core/data/configuration-data.service';
import { ConfigurationProperty } from 'src/app/core/shared/configuration-property.model';
import { Item } from 'src/app/core/shared/item.model';
import { Metadata } from 'src/app/core/shared/metadata.utils';
import {
  getFirstCompletedRemoteData,
  getRemoteDataPayload,
} from 'src/app/core/shared/operators';
import { ItemPageCcLicenseFieldComponent } from 'src/app/item-page/simple/field-components/specific-field/cc-license/item-page-cc-license-field.component';
import { hasValue } from 'src/app/shared/empty.util';
import { MetadataFieldWrapperComponent } from 'src/app/shared/metadata-field-wrapper/metadata-field-wrapper.component';
import { isCcLicense } from 'src/app/shared/utils/license.utils';

@Component({
  selector: 'ds-item-page-license-field',
  templateUrl: './item-page-license-field.component.html',
  standalone: true,
  imports: [NgClass, NgStyle, TranslateModule, MetadataFieldWrapperComponent, ItemPageCcLicenseFieldComponent, AsyncPipe],
})
/**
 * Displays the item's licenses
 *
 * If the number of 'dc.rights*' values (excepting 'dc.rights.uri') and the number of 'dc.rights.uri'
 * match, they will be printed as a list of links, where the text of the link will be the 'dc.rights*'
 * value and the link the corresponding 'dc.rights.uri'. The match will be done in the order they
 * appear. In any other case, all the 'dc.rights*' fields will be shown as a list (where the URIs
 * will be rendered as links).
 */
export class ItemPageLicenseFieldComponent implements OnInit {
  /**
   * The item to display the license for
   */
  @Input() item: Item;

  /**
   * String to use as a separator if multiple rights entries are specified
   */
  @Input() separator = '<br>';

  subscriptions: Subscription[] = [];

  hasCcLicenseName$: Observable<boolean>;
  hasCcLicenseUri$: Observable<boolean>;

  licenses: string[];
  uris: string[];

  constructor(
    protected viewRef: ViewContainerRef,
    protected configService: ConfigurationDataService,
  ) {}

  ngOnInit() {
    // First, retrieve from the back-end the configuration regarding CC fields...
    this.hasCcLicenseName$ = this.configService.findByPropertyName('cc.license.name').pipe(
      getFirstCompletedRemoteData(),
      getRemoteDataPayload(),
      map((configurationProperty: ConfigurationProperty) => configurationProperty?.values?.[0]),
      map((metadataField: string) => hasValue(metadataField) ? metadataField : 'dc.rights'),
      map((metadataField: string) => this.item.firstMetadataValue(metadataField)),
      map((metadataValue: string) => hasValue(metadataValue)),
    );

    this.hasCcLicenseUri$ = this.configService.findByPropertyName('cc.license.uri').pipe(
      getFirstCompletedRemoteData(),
      getRemoteDataPayload(),
      map((configurationProperty: ConfigurationProperty) => configurationProperty?.values?.[0]),
      map((metadataField: string) => hasValue(metadataField) ? metadataField : 'dc.rights'),
      map((metadataField: string) => this.item.firstMetadataValue(metadataField)),
      map((metadataValue: string) => isCcLicense(metadataValue)),
    );

    // Now, get the data for this component, in case we need to render the license data as a generic license...
    // Get all non-empty 'dc.rights*' values, excepting the URIs...
    this.licenses = Metadata
      .all(this.item.metadata, Object.keys(this.item.metadata).filter(key => key !== 'dc.rights.uri' && (key.startsWith('dc.rights') || key.startsWith('dc.rights.'))))
      .map(mdValue => mdValue.value).filter(value => value);
    // and get the URIs
    this.uris = this.item.allMetadataValues('dc.rights.uri').filter(value => value);
  }
}
