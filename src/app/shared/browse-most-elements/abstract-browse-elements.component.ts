import { isPlatformServer } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { APP_CONFIG } from '@dspace/config/app-config.interface';
import { getItemPageRoute } from '@dspace/core/router/utils/dso-route.utils';
import { followLink } from '@dspace/core/shared/follow-link-config.model';
import { PaginatedSearchOptions } from '@dspace/core/shared/search/models/paginated-search-options.model';
import { SearchResult } from '@dspace/core/shared/search/models/search-result.model';
import {
  BehaviorSubject,
  mergeMap,
  Observable,
} from 'rxjs';

import { SearchManager } from '../../core/browse/search-manager';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { RemoteData } from '../../core/data/remote-data';
import { TopSection } from '../../core/layout/models/section.model';
import { Context } from '../../core/shared/context.model';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { Item } from '../../core/shared/item.model';
import {
  getAllCompletedRemoteData,
  getPaginatedListPayload,
  getRemoteDataPayload,
  toDSpaceObjectListRD,
} from '../../core/shared/operators';
import { CollectionElementLinkType } from '../object-collection/collection-element-link.type';


@Component({
  template: '',
})
export abstract class AbstractBrowseElementsComponent implements OnInit, OnChanges {

  protected readonly appConfig = inject(APP_CONFIG);
  protected readonly platformId = inject(PLATFORM_ID);
  protected readonly searchManager = inject(SearchManager);

  protected abstract followThumbnailLink: boolean; // to be overridden

  /**
   * The context of listable object
   */
  @Input() context: Context;

  /**
   * The pagination options
   */
  @Input() paginatedSearchOptions: PaginatedSearchOptions;

  /**
   * Optional projection to use during the search
   */
  @Input() projection;

  /**
   * Whether to show the badge label or not
   */
  @Input() showLabel: boolean;

  /**
   * Whether to show the thumbnail preview
   */
  @Input() showThumbnails = this.appConfig.browseBy.showThumbnails;

  /**
   * TopSection object
   */
  @Input() topSection: TopSection;

  public collectionElementLinkTypeEnum = CollectionElementLinkType;

  paginatedSearchOptions$: BehaviorSubject<PaginatedSearchOptions>;

  searchResults$: Observable<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>>;

  searchResultArray$: Observable<DSpaceObject[]>;

  ngOnChanges() {
    this.paginatedSearchOptions$?.next(this.paginatedSearchOptions);
  }

  ngOnInit() {
    if (isPlatformServer(this.platformId)) {
      return;
    }
    const followLinks = [];
    if (this.followThumbnailLink) {
      followLinks.push(followLink('thumbnail'));
    }

    this.paginatedSearchOptions = Object.assign(new PaginatedSearchOptions({}), this.paginatedSearchOptions, {
      projection: this.projection,
    });

    this.paginatedSearchOptions$ = new BehaviorSubject<PaginatedSearchOptions>(this.paginatedSearchOptions);

    this.searchResults$ = this.paginatedSearchOptions$.asObservable().pipe(
      mergeMap((paginatedSearchOptions) =>
        this.searchManager.search(paginatedSearchOptions, null, true, true, ...followLinks),
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
