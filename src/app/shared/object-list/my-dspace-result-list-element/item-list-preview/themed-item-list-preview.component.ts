import { Component, Input } from '@angular/core';
import { ThemedComponent } from '../../../theme-support/themed.component';
import { ItemListPreviewComponent } from './item-list-preview.component';
import { Item } from '../../../../core/shared/item.model';
import { SearchResult } from '../../../search/models/search-result.model';
import { Context } from 'src/app/core/shared/context.model';
import { WorkflowItem } from 'src/app/core/submission/models/workflowitem.model';

/**
 * Themed wrapper for ItemListPreviewComponent
 */
@Component({
    selector: 'ds-themed-item-list-preview',
    styleUrls: [],
    templateUrl: '../../../theme-support/themed.component.html',
    standalone: true
})
export class ThemedItemListPreviewComponent extends ThemedComponent<ItemListPreviewComponent> {
  protected inAndOutputNames: (keyof ItemListPreviewComponent & keyof this)[] = ['item', 'object', 'badgeContext', 'showSubmitter', 'workflowItem'];

  @Input() item: Item;

  @Input() object: SearchResult<any>;

  @Input() badgeContext: Context;

  @Input() showSubmitter: boolean;

  @Input() workflowItem: WorkflowItem;

  protected getComponentName(): string {
    return 'ItemListPreviewComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../../themes/${themeName}/app/shared/object-list/my-dspace-result-list-element/item-list-preview/item-list-preview.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./item-list-preview.component');
  }
}
