import { ChangeDetectorRef, Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';

import { SearchManager } from '../../core/browse/search-manager';
import { PaginatedSearchOptions } from '../search/models/paginated-search-options.model';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { SearchResult } from '../search/models/search-result.model';
import { Context } from '../../core/shared/context.model';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { followLink } from '../utils/follow-link-config.model';
import { APP_CONFIG, AppConfig } from '../../../config/app-config.interface';

@Component({
  selector: 'ds-browse-most-elements',
  styleUrls: ['./browse-most-elements.component.scss'],
  templateUrl: './browse-most-elements.component.html'
})

export class BrowseMostElementsComponent implements OnInit {

  @Input() paginatedSearchOptions: PaginatedSearchOptions;

  @Input() context: Context;

  /**
   * Whether to show the metrics badges
   */
  @Input() showMetrics;

  /**
   * Whether to show the thumbnail preview
   */
  @Input() showThumbnails;

  searchResults: RemoteData<PaginatedList<SearchResult<DSpaceObject>>>;

  constructor(
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    @Inject(PLATFORM_ID) private platformId: Object,
    private searchService: SearchManager,
    private cdr: ChangeDetectorRef) {

  }

  ngOnInit() {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    const showThumbnails = this.showThumbnails ?? this.appConfig.browseBy.showThumbnails;
    const followLinks = showThumbnails ? [followLink('thumbnail')] : [];
    this.searchService.search(this.paginatedSearchOptions, null, true, true, ...followLinks).pipe(
      getFirstCompletedRemoteData(),
    ).subscribe((response: RemoteData<PaginatedList<SearchResult<DSpaceObject>>>) => {
      this.searchResults = response as any;
      this.cdr.detectChanges();
    });
  }

}
