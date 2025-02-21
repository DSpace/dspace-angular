import { Component } from '@angular/core';

import { ItemSearchResult } from '../../../../../../modules/core/src/lib/core/object-collection/item-search-result.model';
import { Context } from '../../../../../../modules/core/src/lib/core/shared/context.model';
import { Item } from '../../../../../../modules/core/src/lib/core/shared/item.model';
import { ViewMode } from '../../../../../../modules/core/src/lib/core/shared/view-mode.model';
import { ItemActionsComponent } from '../../../mydspace-actions/item/item-actions.component';
import { listableObjectComponent } from '../../../object-collection/shared/listable-object/listable-object.decorator';
import { ItemDetailPreviewComponent } from '../item-detail-preview/item-detail-preview.component';
import { SearchResultDetailElementComponent } from '../search-result-detail-element.component';

/**
 * This component renders item object for the search result in the detail view.
 */
@Component({
  selector: 'ds-item-search-result-detail-element',
  styleUrls: ['../search-result-detail-element.component.scss', './item-search-result-detail-element.component.scss'],
  templateUrl: './item-search-result-detail-element.component.html',
  standalone: true,
  imports: [ItemDetailPreviewComponent, ItemActionsComponent],
})

@listableObjectComponent(ItemSearchResult, ViewMode.DetailedListElement, Context.Workspace)
@listableObjectComponent(ItemSearchResult, ViewMode.DetailedListElement, Context.Workflow)
export class ItemSearchResultDetailElementComponent extends SearchResultDetailElementComponent<ItemSearchResult, Item> {

  /**
   * Represents the badge context
   */
  public badgeContext = Context.MyDSpaceArchived;

}
