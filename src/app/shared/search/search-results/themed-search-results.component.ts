import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { SortOptions } from '../../../core/cache/models/sort-options.model';
import { PaginatedList } from '../../../core/data/paginated-list.model';
import { RemoteData } from '../../../core/data/remote-data';
import { Context } from '../../../core/shared/context.model';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { ViewMode } from '../../../core/shared/view-mode.model';
import { AlertType } from '../../alert/alert-type';
import { CollectionElementLinkType } from '../../object-collection/collection-element-link.type';
import { ListableObject } from '../../object-collection/shared/listable-object.model';
import { ThemedComponent } from '../../theme-support/themed.component';
import { PaginatedSearchOptions } from '../models/paginated-search-options.model';
import { SearchResult } from '../models/search-result.model';
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
  imports: [SearchResultsComponent],
})
export class ThemedSearchResultsComponent extends ThemedComponent<SearchResultsComponent> {

  protected inAndOutputNames: (keyof SearchResultsComponent & keyof this)[] = ['linkType', 'searchResults', 'searchConfig', 'showCsvExport', 'showLabel', 'showMetrics', 'showThumbnails', 'sortConfig', 'viewMode', 'configuration', 'disableHeader', 'selectable', 'context', 'hidePaginationDetail', 'selectionConfig', 'contentChange', 'deselectObject', 'selectObject', 'customData', 'customEvent', 'searchResultNotice', 'searchResultNoticeType', 'showSearchResultNotice', 'showCorrection'];

  @Input() linkType: CollectionElementLinkType;

  @Input() searchResultNotice: string = null;

  @Input() searchResultNoticeType: AlertType = AlertType.Info;

  @Input() searchResults: RemoteData<PaginatedList<SearchResult<DSpaceObject>>>;

  @Input() searchConfig: PaginatedSearchOptions;

  @Input() showCsvExport: boolean;

  @Input() showLabel: boolean;

  @Input() showMetrics: boolean;

  @Input() showThumbnails: boolean;

  @Input() showSearchResultNotice = false;

  @Input() showCorrection = false;

  @Input() sortConfig: SortOptions;

  @Input() viewMode: ViewMode;

  @Input() configuration: string;

  @Input() disableHeader: boolean;

  @Input() selectable: boolean;

  @Input() context: Context;

  @Input() hidePaginationDetail: boolean;

  @Input() selectionConfig: SelectionConfig;

  @Input() customData: any;

  @Output() contentChange: EventEmitter<ListableObject> = new EventEmitter();

  @Output() customEvent: EventEmitter<any> = new EventEmitter<any>();

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
