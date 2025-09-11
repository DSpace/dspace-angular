import { AsyncPipe, isPlatformBrowser, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { APP_CONFIG, AppConfig } from '@dspace/config';
import {
  SortDirection,
  SortOptions,
  PaginatedList,
  RemoteData,
  PaginationService,
  PaginationComponentOptions,
  DSpaceObjectType,
  followLink,
  FollowLinkConfig,
  Item,
  toDSpaceObjectListRD,
  PaginatedSearchOptions,
  ViewMode,
} from '@dspace/core'
import { setPlaceHolderAttributes } from '@dspace/utils';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { fadeIn, fadeInOut } from '../../shared/animations/fade';
import { ErrorComponent } from '../../shared/error/error.component';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import {
  ListableObjectComponentLoaderComponent,
} from '../../shared/object-collection/shared/listable-object/listable-object-component-loader.component';
import { SearchService } from '../../shared/search/search.service';
import { SearchConfigurationService } from '../../shared/search/search-configuration.service';
import { VarDirective } from '../../shared/utils/var.directive';

@Component({
  selector: 'ds-recent-item-list',
  templateUrl: './recent-item-list.component.html',
  styleUrls: ['./recent-item-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeIn,
    fadeInOut,
  ],
  standalone: true,
  imports: [
    AsyncPipe,
    ErrorComponent,
    ListableObjectComponentLoaderComponent,
    NgClass,
    ThemedLoadingComponent,
    TranslateModule,
    VarDirective,
  ],
})
export class RecentItemListComponent implements OnInit, OnDestroy {
  itemRD$: Observable<RemoteData<PaginatedList<Item>>>;
  paginationConfig: PaginationComponentOptions;
  sortConfig: SortOptions;

  /**
 * The view-mode we're currently on
 * @type {ViewMode}
 */
  viewMode = ViewMode.ListElement;

  private _placeholderFontClass: string;

  constructor(
    private searchService: SearchService,
    private paginationService: PaginationService,
    public searchConfigurationService: SearchConfigurationService,
    protected elementRef: ElementRef,
    @Inject(APP_CONFIG) private appConfig: AppConfig,
    @Inject(PLATFORM_ID) private platformId: any,
  ) {

    this.paginationConfig = Object.assign(new PaginationComponentOptions(), {
      id: 'hp',
      pageSize: environment.homePage.recentSubmissions.pageSize,
      currentPage: 1,
      maxSize: 1,
    });
    this.sortConfig = new SortOptions(environment.homePage.recentSubmissions.sortField, SortDirection.DESC);
  }
  ngOnInit(): void {
    const linksToFollow: FollowLinkConfig<Item>[] = [];
    if (this.appConfig.browseBy.showThumbnails) {
      linksToFollow.push(followLink('thumbnail'));
    }
    if (this.appConfig.item.showAccessStatuses) {
      linksToFollow.push(followLink('accessStatus'));
    }

    this.itemRD$ = this.searchService.search(
      new PaginatedSearchOptions({
        pagination: this.paginationConfig,
        dsoTypes: [DSpaceObjectType.ITEM],
        sort: this.sortConfig,
      }),
      undefined,
      undefined,
      undefined,
      ...linksToFollow,
    ).pipe(
      toDSpaceObjectListRD(),
    ) as Observable<RemoteData<PaginatedList<Item>>>;
  }

  ngOnDestroy(): void {
    this.paginationService.clearPagination(this.paginationConfig.id);
  }

  onLoadMore(): void {
    this.paginationService.updateRouteWithUrl(this.searchConfigurationService.paginationID, ['search'], {
      sortField: environment.homePage.recentSubmissions.sortField,
      sortDirection: 'DESC' as SortDirection,
      page: 1,
    });
  }

  get placeholderFontClass(): string {
    if (this._placeholderFontClass === undefined) {
      if (isPlatformBrowser(this.platformId)) {
        const width = this.elementRef.nativeElement.offsetWidth;
        this._placeholderFontClass = setPlaceHolderAttributes(width);
      } else {
        this._placeholderFontClass = 'hide-placeholder-text';
      }
    }
    return this._placeholderFontClass;
  }

}

