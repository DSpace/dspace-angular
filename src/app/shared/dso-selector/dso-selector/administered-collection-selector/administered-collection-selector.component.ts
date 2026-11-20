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
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
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
  selector: 'ds-administered-collection-selector',
  styleUrls: ['../dso-selector.component.scss'],
  templateUrl: '../dso-selector.component.html',
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
export class AdministeredCollectionSelectorComponent extends DSOSelectorComponent {

  constructor(protected collectionDataService: CollectionDataService,
              protected searchService: SearchService,
              protected notifcationsService: NotificationsService,
              protected translate: TranslateService,
              protected dsoNameService: DSONameService) {
    super(searchService, notifcationsService, translate, dsoNameService);
  }

  /**
   * If present this value is used to filter collection list by entity type
   */
  @Input() entityType: string;

  /**
   * Get a query to send for retrieving the current DSO
   */
  getCurrentDSOQuery(): string {
    return this.currentDSOId;
  }

  /**
   * Perform a search for administered collections with the current query and page
   * @param query Query to search objects for
   * @param page  Page to retrieve
   */
  search(query: string, page: number): Observable<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>> {
    const findOptions: FindListOptions = {
      currentPage: page,
      elementsPerPage: this.defaultPagination.pageSize,
    };

    const search$ = this.entityType
      ? this.collectionDataService.getAdministeredCollectionByEntityType(query,this.entityType, findOptions)
      :  this.collectionDataService.getAdministeredCollection(query, findOptions);

    return search$.pipe(
      getFirstCompletedRemoteData(),
      map((rd) => Object.assign(new RemoteData(null, null, null, null), rd, {
        payload: hasValue(rd.payload) ? buildPaginatedList(rd.payload.pageInfo, rd.payload.page.map((col) => Object.assign(new CollectionSearchResult(), { indexableObject: col }))) : null,
      })),
    );
  }

}
