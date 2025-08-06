import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { SortOptions } from '@dspace/core/cache/models/sort-options.model';
import { PaginatedList } from '@dspace/core/data/paginated-list.model';
import { RemoteData } from '@dspace/core/data/remote-data';
import { Context } from '@dspace/core/shared/context.model';
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import { ListableObject } from '@dspace/core/shared/object-collection/listable-object.model';
import { PaginatedSearchOptions } from '@dspace/core/shared/search/models/paginated-search-options.model';
import { SearchResult } from '@dspace/core/shared/search/models/search-result.model';
import { ViewMode } from '@dspace/core/shared/view-mode.model';

import { CollectionElementLinkType } from '../../object-collection/collection-element-link.type';
import { ThemedComponent } from '../../theme-support/themed.component';
import {
  SearchResultsComponent,
  SelectionConfig,
} from './search-results.component';

/**
 * Themed wrapper for SearchResultsComponent
 */
@Component({
  selector: 'ds-search-results',
  styleUrls: [],
  templateUrl: '../../theme-support/themed.component.html',
  standalone: true,
  imports: [
    SearchResultsComponent,
  ],
})
export class ThemedSearchResultsComponent extends ThemedComponent<SearchResultsComponent> {

  protected inAndOutputNames: (keyof SearchResultsComponent & keyof this)[] = ['linkType', 'searchResults', 'searchConfig', 'showCsvExport', 'showThumbnails', 'sortConfig', 'viewMode', 'configuration', 'disableHeader', 'selectable', 'context', 'hidePaginationDetail', 'selectionConfig', 'contentChange', 'deselectObject', 'selectObject'];

  @Input() linkType: CollectionElementLinkType;

  @Input() searchResults: RemoteData<PaginatedList<SearchResult<DSpaceObject>>>;

  @Input() searchConfig: PaginatedSearchOptions;

  @Input() showCsvExport: boolean;

  @Input() showThumbnails: boolean;

  @Input() sortConfig: SortOptions;

  @Input() viewMode: ViewMode;

  @Input() configuration: string;

  @Input() disableHeader: boolean;

  @Input() selectable: boolean;

  @Input() context: Context;

  @Input() hidePaginationDetail: boolean;

  @Input() selectionConfig: SelectionConfig;

  @Output() contentChange: EventEmitter<ListableObject> = new EventEmitter();

  @Output() deselectObject: EventEmitter<ListableObject> = new EventEmitter();

  @Output() selectObject: EventEmitter<ListableObject> = new EventEmitter();

  protected getComponentName(): string {
    return 'SearchResultsComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../themes/${themeName}/app/shared/search/search-results/search-results.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./search-results.component');
  }

}
