import {
  Component,
  Input,
} from '@angular/core';
import { Item } from '@dspace/core/shared/item.model';
import { SearchResult } from '@dspace/core/shared/search/models/search-result.model';

import { ThemedComponent } from '../../../../theme-support/themed.component';
import { ItemDetailPreviewFieldComponent } from './item-detail-preview-field.component';

/**
 * Themed wrapper for {@link ItemDetailPreviewFieldComponent}
 */
@Component({
  selector: 'ds-item-detail-preview-field',
  templateUrl: '../../../../theme-support/themed.component.html',
})
export class ThemedItemDetailPreviewFieldComponent  extends ThemedComponent<ItemDetailPreviewFieldComponent> {

  protected inAndOutputNames: (keyof ItemDetailPreviewFieldComponent & keyof this)[] = [
    'item',
    'object',
    'label',
    'metadata',
    'placeholder',
    'separator',
    'escapeMetadataHTML',
  ];

  @Input() item: Item;

  @Input() object: SearchResult<any>;

  @Input() label: string;

  @Input() metadata: string | string[];

  @Input() placeholder: string;

  @Input() separator: string;

  @Input() escapeMetadataHTML: boolean;

  protected getComponentName(): string {
    return 'ItemDetailPreviewFieldComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../../themes/${themeName}/app/shared/object-detail/my-dspace-result-detail-element/item-detail-preview/item-detail-preview-field/item-detail-preview-field.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./item-detail-preview-field.component');
  }
}
