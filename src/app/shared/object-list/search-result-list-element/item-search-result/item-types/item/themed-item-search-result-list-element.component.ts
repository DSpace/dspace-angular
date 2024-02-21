import { Component, Input } from '@angular/core';
import { CollectionElementLinkType } from 'src/app/shared/object-collection/collection-element-link.type';
import { ThemedComponent } from 'src/app/shared/theme-support/themed.component';
import { ItemSearchResultListElementComponent } from './item-search-result-list-element.component';

/*
 * Themed wrapper for ItemSearchResultListElementComponent
 */

@Component({
    selector: 'ds-themed-item-search-result-list-element',
    styleUrls: [],
    templateUrl: '../../../../../../../app/shared/theme-support/themed.component.html',
})
export class ThemedItemSearchResultListElementComponent
  extends ThemedComponent<ItemSearchResultListElementComponent> {
  @Input() showLabel: boolean;
  @Input() object: any;
  @Input() linkType: CollectionElementLinkType;
  protected inAndOutputNames: (keyof ItemSearchResultListElementComponent & keyof this)[] = [
    'showLabel',
    'object',
    'linkType',
    ];

  protected getComponentName(): string {
    return 'ItemSearchResultListElementComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../../../themes/${themeName}/app/shared/object-list/search-result-list-element/item-search-result/item-types/item/item-search-result-list-element.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./item-search-result-list-element.component');
  }
}
