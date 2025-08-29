import {
  Component,
  Input,
} from '@angular/core';
import { Context } from '@dspace/core/shared/context.model';
import { Item } from '@dspace/core/shared/item.model';
import { SearchResult } from '@dspace/core/shared/search/models/search-result.model';
import { WorkflowItem } from '@dspace/core/submission/models/workflowitem.model';

import { ThemedComponent } from '../../../theme-support/themed.component';
import { ItemListPreviewComponent } from './item-list-preview.component';

/**
 * Themed wrapper for ItemListPreviewComponent
 */
@Component({
  selector: 'ds-item-list-preview',
  styleUrls: [],
  templateUrl: '../../../theme-support/themed.component.html',
  standalone: true,
  imports: [
    ItemListPreviewComponent,
  ],
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
