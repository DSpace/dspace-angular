import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import { Component } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { followLink } from '@dspace/core/shared/follow-link-config.model';
import { CommunitySearchResult } from '@dspace/core/shared/object-collection/community-search-result.model';
import { SearchResult } from '@dspace/core/shared/search/models/search-result.model';
import { hasValue } from '@dspace/shared/utils/empty.util';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { CommunityDataService } from '../../../../core/data/community-data.service';
import { FindListOptions } from '../../../../core/data/find-list-options.model';
import {
  buildPaginatedList,
  PaginatedList,
} from '../../../../core/data/paginated-list.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { Community } from '../../../../core/shared/community.model';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { getFirstCompletedRemoteData } from '../../../../core/shared/operators';
import { HoverClassDirective } from '../../../hover-class.directive';
import { ThemedLoadingComponent } from '../../../loading/themed-loading.component';
import { ListableObjectComponentLoaderComponent } from '../../../object-collection/shared/listable-object/listable-object-component-loader.component';
import { SearchService } from '../../../search/search.service';
import { DSOSelectorComponent } from '../dso-selector.component';

@Component({
  selector: 'ds-authorized-community-selector',
  styleUrls: ['../dso-selector.component.scss'],
  templateUrl: '../dso-selector.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    HoverClassDirective,
    InfiniteScrollModule,
    ListableObjectComponentLoaderComponent,
    NgClass,
    ReactiveFormsModule,
    ThemedLoadingComponent,
    TranslateModule,
  ],
})
/**
 * Component rendering a list of communities to select from
 */
export class AuthorizedCommunitySelectorComponent extends DSOSelectorComponent {
  /**
   * If present this value is used to filter community list by entity type
   */

  constructor(
    protected searchService: SearchService,
    protected communityDataService: CommunityDataService,
    protected notifcationsService: NotificationsService,
    protected translate: TranslateService,
    protected dsoNameService: DSONameService,
  ) {
    super(searchService, notifcationsService, translate, dsoNameService);
  }

  /**
   * Get a query to send for retrieving the current DSO
   */
  getCurrentDSOQuery(): string {
    return this.currentDSOId;
  }

  /**
   * Perform a search for authorized communities with the current query and page
   * @param query Query to search objects for
   * @param page  Page to retrieve
   * @param useCache Whether or not to use the cache
   */
  search(query: string, page: number, useCache: boolean = true): Observable<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>> {
    let searchListService$: Observable<RemoteData<PaginatedList<Community>>> = null;
    const findOptions: FindListOptions = {
      currentPage: page,
      elementsPerPage: this.defaultPagination.pageSize,
    };

    searchListService$ = this.communityDataService
      .getAuthorizedCommunity(query, findOptions, useCache, false, followLink('parentCommunity'));

    return searchListService$.pipe(
      getFirstCompletedRemoteData(),
      map((rd) => Object.assign(new RemoteData(null, null, null, null), rd, {
        payload: hasValue(rd.payload) ? buildPaginatedList(rd.payload.pageInfo, rd.payload.page.map((col) => Object.assign(new CommunitySearchResult(), { indexableObject: col }))) : null,
      })),
    );
  }
}
