import { Component, InjectionToken, Injector, Input, OnInit } from '@angular/core';
import { SearchResult } from '../../../+search-page/search-result.model';
import { Item } from '../../../core/shared/item.model';
import { hasValue } from '../../empty.util';
import { ItemSearchResult } from '../../object-collection/shared/item-search-result.model';
import { getComponentByItemType } from '../item-type-decorator';
import { MetadataRepresentation } from '../../../core/shared/metadata-representation/metadata-representation.model';

export const ITEM: InjectionToken<string> = new InjectionToken<string>('item');

@Component({
  selector: 'ds-item-type-switcher',
  styleUrls: ['./item-type-switcher.component.scss'],
  templateUrl: './item-type-switcher.component.html'
})
/**
 * Component for determining what component to use depending on the item's relationship type (relationship.type)
 */
export class ItemTypeSwitcherComponent implements OnInit {
  /**
   * The item or metadata to determine the component for
   */
  @Input() object: Item | SearchResult<Item> | MetadataRepresentation;

  /**
   * The preferred view-mode to display
   */
  @Input() viewMode: string;

  /**
   * The object injector used to inject the item into the child component
   */
  objectInjector: Injector;

  component: any;

  constructor(private injector: Injector) {
  }

  ngOnInit(): void {
    this.objectInjector = Injector.create({
      providers: [{ provide: ITEM, useFactory: () => this.object, deps:[] }],
      parent: this.injector
    });
    this.component = this.getComponent();
  }

  /**
   * Fetch the component depending on the item's relationship type
   * @returns {string}
   */
  private getComponent(): string {
    if (hasValue((this.object as any).representationType)) {
      const metadataRepresentation = this.object as MetadataRepresentation;
      return getComponentByItemType(metadataRepresentation.itemType, this.viewMode, metadataRepresentation.representationType);
    }

    let item: Item;
    if (hasValue((this.object as any).indexableObject)) {
      const searchResult = this.object as ItemSearchResult;
      item = searchResult.indexableObject;
    } else {
      item = this.object as Item;
    }

    const type = item.firstMetadataValue('relationship.type');
    return getComponentByItemType(type, this.viewMode);
  }
}
