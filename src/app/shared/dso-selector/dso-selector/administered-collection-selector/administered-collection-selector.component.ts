import {
  AsyncPipe,
  NgClass,
  NgFor,
  NgIf,
} from '@angular/common';
import {
  Component,
  Input,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { CollectionDataService } from '../../../../core/data/collection-data.service';
import { FindListOptions } from '../../../../core/data/find-list-options.model';
import {
  buildPaginatedList,
  PaginatedList,
} from '../../../../core/data/paginated-list.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { getFirstCompletedRemoteData } from '../../../../core/shared/operators';
import { SearchService } from '../../../../core/shared/search/search.service';
import { hasValue } from '../../../empty.util';
import { HoverClassDirective } from '../../../hover-class.directive';
import { ThemedLoadingComponent } from '../../../loading/themed-loading.component';
import { NotificationsService } from '../../../notifications/notifications.service';
import { CollectionSearchResult } from '../../../object-collection/shared/collection-search-result.model';
import { ListableObjectComponentLoaderComponent } from '../../../object-collection/shared/listable-object/listable-object-component-loader.component';
import { SearchResult } from '../../../search/models/search-result.model';
import { DSOSelectorComponent } from '../dso-selector.component';

@Component({
  selector: 'ds-administered-collection-selector',
  styleUrls: ['../dso-selector.component.scss'],
  templateUrl: '../dso-selector.component.html',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, InfiniteScrollModule, NgIf, NgFor, HoverClassDirective, NgClass, ListableObjectComponentLoaderComponent, ThemedLoadingComponent, AsyncPipe, TranslateModule],
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
