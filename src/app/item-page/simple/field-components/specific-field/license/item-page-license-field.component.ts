import {
  NgClass,
  NgIf,
  NgFor,
  NgStyle,
} from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Item } from 'src/app/core/shared/item.model';
import { MetadataFieldWrapperComponent } from 'src/app/shared/metadata-field-wrapper/metadata-field-wrapper.component';
import { ItemPageCcLicenseFieldComponent } from 'src/app/item-page/simple/field-components/specific-field/cc-license/item-page-cc-license-field.component';
import { Metadata } from 'src/app/core/shared/metadata.utils';

@Component({
  selector: 'ds-item-page-license-field',
  templateUrl: './item-page-license-field.component.html',
  styleUrl: './item-page-license-field.scss',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, NgStyle, TranslateModule, MetadataFieldWrapperComponent, ItemPageCcLicenseFieldComponent],
})
/**
 * Displays the item's licenses
 * 
 * If the number of 'dc.rights*' values (excepting 'dc.rights.uri') and the number of 'dc.rights.uri'
 * match, they will be printed as a list of links, where the text of the link will be the dc.right* 
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
   * String to use as a separator if multiple license entries are specified
   */
  @Input() separator: String = '•';

  uris: string[];
  licenses: string[];
  isCcLicense: boolean;

  constructor(private viewRef: ViewContainerRef) {}

  ngOnInit() {
    // This is a workaround to determine which fields are relevant to render a CC license
    // until https://github.com/DSpace/dspace-angular/pull/3165 is merged in the main branch
    // (which will provide a configuration property).
    // Until then, we must dynamically create a ItemPageCcLicenseFieldComponent to retrieve
    // the fields that are relevant to render a CC license field (since developers may have
    // customized them directly in the code).
    // This approach avoids hardcoding the values (thus breaking developers' customizations)
    // and makes this code compatible with a future merge of the above PR
    const ccComponentRef = this.viewRef.createComponent(ItemPageCcLicenseFieldComponent);
    ccComponentRef.setInput('item', this.item);
    // The regex below has been copied from ItemPageCcLicenseFieldComponent
    // We duplicate the regex here to avoid changing the implementation of
    // ItemPageCcLicenseFieldComponent to avoid breaking changes.
    // It may be desirable to further refactor this code in the future
    const regex = /.*creativecommons.org\/(licenses|publicdomain)\/([^/]+)/gm;
    
    // If the license information is a CC License, we will delegate the rendering
    // of this field to ItemPageCcLicenseFieldComponent
    this.isCcLicense = this.item.allMetadataValues(ccComponentRef.instance.ccLicenseUriField).length == 1 
                        && regex.exec(this.item.firstMetadataValue(ccComponentRef.instance.ccLicenseUriField)) != null 
                        && this.item.allMetadataValues(ccComponentRef.instance.ccLicenseNameField).length == 1;
    // We no longer need the ItemPageCcLicenseFieldComponent (and we don't want it to be rendered here)
    ccComponentRef.destroy();

    // In either case...
    // get all non-empty dc.rights* values, excepting the URIs...
    this.licenses = Metadata.all(this.item.metadata, Object.keys(this.item.metadata).filter(key => 
                          key != 'dc.rights.uri' && (key.startsWith('dc.rights') || key.startsWith('dc.rights.')))
                    ).map(mdValue => mdValue.value).filter(value => value);
    // and get the URIs
    this.uris = this.item.allMetadataValues('dc.rights.uri').filter(value => value);
  }
}
