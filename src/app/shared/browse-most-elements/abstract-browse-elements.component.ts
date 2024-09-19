import { followLink } from '../utils/follow-link-config.model';
import { CollectionElementLinkType } from '../object-collection/collection-element-link.type';
import { TopSection } from '../../core/layout/models/section.model';
import { Component, Input, OnChanges, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformServer } from '@angular/common';

import { SearchService } from '../../core/shared/search/search.service';
import { PaginatedSearchOptions } from '../search/models/paginated-search-options.model';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { SearchResult } from '../search/models/search-result.model';
import { Context } from '../../core/shared/context.model';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list.model';
import {
  getAllCompletedRemoteData,
  getPaginatedListPayload,
  getRemoteDataPayload,
  toDSpaceObjectListRD,
} from '../../core/shared/operators';
import { APP_CONFIG } from '../../../config/app-config.interface';
import { BehaviorSubject, Observable, mergeMap } from 'rxjs';
import { Item } from '../../core/shared/item.model';
import { getItemPageRoute } from '../../item-page/item-page-routing-paths';

@Component({
  template: ''
})
export abstract class AbstractBrowseElementsComponent implements OnInit, OnChanges {

  protected readonly appConfig = inject(APP_CONFIG);
  protected readonly platformId = inject(PLATFORM_ID);
  protected readonly searchService = inject(SearchService);

  protected followThumbnailLink: boolean; // to be overridden

  @Input() paginatedSearchOptions: PaginatedSearchOptions;

  @Input() context: Context;

  @Input() topSection: TopSection;

  public collectionElementLinkTypeEnum = CollectionElementLinkType;

  paginatedSearchOptionsBS: BehaviorSubject<PaginatedSearchOptions>;

  searchResults$: Observable<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>>;

  searchResultArray$: Observable<DSpaceObject[]>;

  ngOnChanges() {
    if (isPlatformServer(this.platformId)) {
      return;
    }
    this.paginatedSearchOptionsBS?.next(this.paginatedSearchOptions);
  }

  ngOnInit() {
    const followLinks = this.followThumbnailLink ? [followLink('thumbnail'), followLink('metrics')] : [followLink('metrics')];
    this.paginatedSearchOptionsBS = new BehaviorSubject<PaginatedSearchOptions>(this.paginatedSearchOptions);
    this.searchResults$ = this.paginatedSearchOptionsBS.asObservable().pipe(
      mergeMap((paginatedSearchOptions) =>
        this.searchService.search(paginatedSearchOptions, null, true, true, ...followLinks),
      ),
      getAllCompletedRemoteData(),
    );

    this.searchResultArray$ = this.searchResults$.pipe(
      toDSpaceObjectListRD(),
      getRemoteDataPayload(),
      getPaginatedListPayload(),
    );
  }

  getItemPageRoute(item: DSpaceObject | Item) {
    return getItemPageRoute(item as Item);
  }
}
