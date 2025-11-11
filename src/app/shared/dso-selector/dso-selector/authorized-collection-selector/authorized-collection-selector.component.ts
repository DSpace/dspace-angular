import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { CollectionDataService } from '@dspace/core/data/collection-data.service';
import { FindListOptions } from '@dspace/core/data/find-list-options.model';
import {
  buildPaginatedList,
  PaginatedList,
} from '@dspace/core/data/paginated-list.model';
import { RemoteData } from '@dspace/core/data/remote-data';
import { NotificationsService } from '@dspace/core/notification-system/notifications.service';
import { Collection } from '@dspace/core/shared/collection.model';
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import { followLink } from '@dspace/core/shared/follow-link-config.model';
import { CollectionSearchResult } from '@dspace/core/shared/object-collection/collection-search-result.model';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import { SearchResult } from '@dspace/core/shared/search/models/search-result.model';
import { hasValue } from '@dspace/shared/utils/empty.util';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HoverClassDirective } from '../../../hover-class.directive';
import { ThemedLoadingComponent } from '../../../loading/themed-loading.component';
import { ListableObjectComponentLoaderComponent } from '../../../object-collection/shared/listable-object/listable-object-component-loader.component';
import { SearchService } from '../../../search/search.service';
import { DSOSelectorComponent } from '../dso-selector.component';

@Component({
  selector: 'ds-authorized-collection-selector',
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
 * Component rendering a list of collections to select from
 */
export class AuthorizedCollectionSelectorComponent extends DSOSelectorComponent {
  /**
   * If present this value is used to filter collection list by entity type
   */
  @Input() entityType: string;

  /**
   * Search endpoint to use for finding authorized collections.
   * Defaults to 'findSubmitAuthorized', but can be overridden (e.g. to 'findAdminAuthorized')
   */
  @Input() searchHref = 'findSubmitAuthorized';

  constructor(
    protected searchService: SearchService,
    protected collectionDataService: CollectionDataService,
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
   * Perform a search for authorized collections with the current query and page
   * @param query Query to search objects for
   * @param page  Page to retrieve
   * @param useCache Whether or not to use the cache
   */
  search(query: string, page: number, useCache: boolean = true): Observable<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>> {
    let searchListService$: Observable<RemoteData<PaginatedList<Collection>>> = null;
    const findOptions: FindListOptions = {
      currentPage: page,
      elementsPerPage: this.defaultPagination.pageSize,
    };

    if (this.entityType) {
      searchListService$ = this.collectionDataService
        .getAuthorizedCollectionByEntityType(
          query,
          this.entityType,
          findOptions);
    } else {
      searchListService$ = this.collectionDataService
        .getAuthorizedCollection(query, findOptions, useCache, false, this.searchHref, followLink('parentCommunity'));
    }
    return searchListService$.pipe(
      getFirstCompletedRemoteData(),
      map((rd) => Object.assign(new RemoteData(null, null, null, null), rd, {
        payload: hasValue(rd.payload) ? buildPaginatedList(rd.payload.pageInfo, rd.payload.page.map((col) => Object.assign(new CollectionSearchResult(), { indexableObject: col }))) : null,
      })),
    );
  }
}
