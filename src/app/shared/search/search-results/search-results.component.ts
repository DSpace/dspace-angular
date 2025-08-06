import { AsyncPipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { SortOptions } from '@dspace/core/cache/models/sort-options.model';
import { PaginatedList } from '@dspace/core/data/paginated-list.model';
import { RemoteData } from '@dspace/core/data/remote-data';
import { Context } from '@dspace/core/shared/context.model';
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import { ListableObject } from '@dspace/core/shared/object-collection/listable-object.model';
import { AppliedFilter } from '@dspace/core/shared/search/models/applied-filter.model';
import { PaginatedSearchOptions } from '@dspace/core/shared/search/models/paginated-search-options.model';
import { SearchFilter } from '@dspace/core/shared/search/models/search-filter.model';
import { SearchResult } from '@dspace/core/shared/search/models/search-result.model';
import { ViewMode } from '@dspace/core/shared/view-mode.model';
import {
  hasNoValue,
  isNotEmpty,
} from '@dspace/shared/utils/empty.util';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {
  BehaviorSubject,
  Observable,
} from 'rxjs';

import {
  fadeIn,
  fadeInOut,
} from '../../animations/fade';
import { ErrorComponent } from '../../error/error.component';
import { CollectionElementLinkType } from '../../object-collection/collection-element-link.type';
import { ObjectCollectionComponent } from '../../object-collection/object-collection.component';
import { SearchService } from '../search.service';
import { SearchConfigurationService } from '../search-configuration.service';
import { SearchExportCsvComponent } from '../search-export-csv/search-export-csv.component';
import { SearchResultsSkeletonComponent } from './search-results-skeleton/search-results-skeleton.component';

export interface SelectionConfig {
  repeatable: boolean;
  listId: string;
}

@Component({
  selector: 'ds-base-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
  animations: [
    fadeIn,
    fadeInOut,
  ],
  standalone: true,
  imports: [
    AsyncPipe,
    ErrorComponent,
    NgxSkeletonLoaderModule,
    ObjectCollectionComponent,
    RouterLink,
    SearchExportCsvComponent,
    SearchResultsSkeletonComponent,
    TranslateModule,
  ],
})

/**
 * Component that represents all results from a search
 */
export class SearchResultsComponent {
  hasNoValue = hasNoValue;
  /**
   * Currently active filters in url
   */
  activeFilters$: Observable<SearchFilter[]>;

  /**
   * Filter applied to show labels, once populated the activeFilters$ will be loaded
   */
  appliedFilters$: BehaviorSubject<AppliedFilter[]>;

  /**
   * The link type of the listed search results
   */
  @Input() linkType: CollectionElementLinkType;

  /**
   * The actual search result objects
   */
  @Input() searchResults: RemoteData<PaginatedList<SearchResult<DSpaceObject>>>;

  /**
   * The current configuration of the search
   */
  @Input() searchConfig: PaginatedSearchOptions;

  /**
   * A boolean representing if show csv export button
   */
  @Input() showCsvExport = false;

  /**
   * Whether to show the thumbnail preview
   */
  @Input() showThumbnails;

  /**
   * The current sorting configuration of the search
   */
  @Input() sortConfig: SortOptions;

  /**
   * The current view-mode of the list
   */
  @Input() viewMode: ViewMode;

  /**
   * An optional configuration to filter the result on one type
   */
  @Input() configuration: string;

  /**
   * Whether or not to hide the header of the results
   * Defaults to a visible header
   */
  @Input() disableHeader = false;

  /**
   * A boolean representing if result entries are selectable
   */
  @Input() selectable = false;

  @Input() context: Context;

  /**
   * Option for hiding the pagination detail
   */
  @Input() hidePaginationDetail = false;

  /**
   * The config option used for selection functionality
   */
  @Input() selectionConfig: SelectionConfig = null;

  /**
   * Emit when one of the listed object has changed.
   */
  @Output() contentChange = new EventEmitter<any>();

  @Output() deselectObject: EventEmitter<ListableObject> = new EventEmitter<ListableObject>();

  @Output() selectObject: EventEmitter<ListableObject> = new EventEmitter<ListableObject>();

  constructor(
    protected searchConfigService: SearchConfigurationService,
    protected searchService: SearchService,
  ) {
    this.activeFilters$ = this.searchConfigService.getCurrentFilters();
    this.appliedFilters$ = this.searchService.appliedFilters$;
  }

  /**
   * Check if search results are loading
   */
  isLoading(): boolean {
    return !this.showError() && (hasNoValue(this.searchResults) || hasNoValue(this.searchResults.payload) || this.searchResults.isLoading);
  }

  showError(): boolean {
    return this.searchResults?.hasFailed && (!this.searchResults?.errorMessage || this.searchResults?.statusCode !== 400);
  }

  errorMessageLabel(): string {
    return (this.searchResults?.statusCode  === 422) ? 'error.invalid-search-query' : 'error.search-results';
  }

  /**
   * Method to change the given string by surrounding it by quotes if not already present.
   */
  surroundStringWithQuotes(input: string): string {
    let result = input;

    if (isNotEmpty(result) && !(result.startsWith('\"') && result.endsWith('\"'))) {
      result = `"${result}"`;
    }

    return result;
  }
}
