import { Component, Input } from '@angular/core';
import { listableObjectComponent } from '../../../../../object-collection/shared/listable-object/listable-object.decorator';
import { ViewMode } from '../../../../../../core/shared/view-mode.model';
import { ItemSearchResult } from '../../../../../object-collection/shared/item-search-result.model';
import { SearchResultListElementComponent } from '../../../search-result-list-element.component';
import { Item } from '../../../../../../core/shared/item.model';
import { getItemPageRoute } from '../../../../../../item-page/item-page-routing-paths';
import { Context } from '../../../../../../core/shared/context.model';
import { TruncatableService } from '../../../../../truncatable/truncatable.service';
import { DSONameService } from '../../../../../../core/breadcrumbs/dso-name.service';

@listableObjectComponent('PublicationSearchResult', ViewMode.ListElement)
@listableObjectComponent(ItemSearchResult, ViewMode.ListElement)
@listableObjectComponent(ItemSearchResult, ViewMode.ListElement, Context.BrowseMostElements)
@Component({
  selector: 'ds-item-search-result-list-element',
  styleUrls: ['./item-search-result-list-element.component.scss'],
  templateUrl: './item-search-result-list-element.component.html'
})
/**
 * The component for displaying a list element for an item search result of the type Publication
 */
export class ItemSearchResultListElementComponent extends SearchResultListElementComponent<ItemSearchResult, Item> {

  @Input() hideMetrics = false;

  public constructor(protected truncatableService: TruncatableService, protected dsoNameService: DSONameService) {
    super(truncatableService, dsoNameService);
  }

  /**
   * Route to the item's page
   */
  itemPageRoute: string;

  ngOnInit(): void {
    super.ngOnInit();
    this.itemPageRoute = getItemPageRoute(this.dso);
  }
}
