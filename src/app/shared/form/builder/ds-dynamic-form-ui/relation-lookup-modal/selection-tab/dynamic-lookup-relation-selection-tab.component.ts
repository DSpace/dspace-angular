import { AsyncPipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import {
  map,
  switchMap,
  take,
} from 'rxjs/operators';

import {
  buildPaginatedList,
  PaginatedList,
} from '../../../../../../../../modules/core/src/lib/core/data/paginated-list.model';
import { RemoteData } from '../../../../../../../../modules/core/src/lib/core/data/remote-data';
import { ListableObject } from '../../../../../../../../modules/core/src/lib/core/object-collection/listable-object.model';
import { PaginationService } from '../../../../../../../../modules/core/src/lib/core/pagination/pagination.service';
import { Context } from '../../../../../../../../modules/core/src/lib/core/shared/context.model';
import { DSpaceObject } from '../../../../../../../../modules/core/src/lib/core/shared/dspace-object.model';
import { PageInfo } from '../../../../../../../../modules/core/src/lib/core/shared/page-info.model';
import { PaginatedSearchOptions } from '../../../../../../../../modules/core/src/lib/core/shared/paginated-search-options.model';
import { PaginationComponentOptions } from '../../../../../../../../modules/core/src/lib/core/shared/pagination-component-options.model';
import { SearchResult } from '../../../../../../../../modules/core/src/lib/core/shared/search/models/search-result.model';
import { SearchConfigurationService } from '../../../../../../../../modules/core/src/lib/core/shared/search/search-configuration.service';
import { createSuccessfulRemoteDataObject } from '../../../../../../../../modules/core/src/lib/core/utilities/remote-data.utils';
import { SEARCH_CONFIG_SERVICE } from '../../../../../../my-dspace-page/my-dspace-configuration.service';
import { ObjectCollectionComponent } from '../../../../../object-collection/object-collection.component';
import { PageSizeSelectorComponent } from '../../../../../page-size-selector/page-size-selector.component';

@Component({
  selector: 'ds-dynamic-lookup-relation-selection-tab',
  styleUrls: ['./dynamic-lookup-relation-selection-tab.component.scss'],
  templateUrl: './dynamic-lookup-relation-selection-tab.component.html',
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService,
    },
  ],
  imports: [
    PageSizeSelectorComponent,
    ObjectCollectionComponent,
    AsyncPipe,
    TranslateModule,
  ],
  standalone: true,
})

/**
 * Tab for inside the lookup model that represents the currently selected relationships
 */
export class DsDynamicLookupRelationSelectionTabComponent implements OnInit {
  /**
   * A string that describes the type of relationship
   */
  @Input() relationshipType: string;

  /**
   * The ID of the list to add/remove selected items to/from
   */
  @Input() listId: string;

  /**
   * Is the selection repeatable?
   */
  @Input() repeatable: boolean;

  /**
   * The list of selected items
   */
  @Input() selection$: Observable<ListableObject[]>;

  /**
   * The paginated list of selected items
   */
  @Input() selectionRD$: Observable<RemoteData<PaginatedList<ListableObject>>>;

  /**
   * The context to display lists
   */
  @Input() context: Context;

  /**
   * Send an event to deselect an object from the list
   */
  @Output() deselectObject: EventEmitter<SearchResult<DSpaceObject>> = new EventEmitter();

  /**
   * Send an event to select an object from the list
   */
  @Output() selectObject: EventEmitter<SearchResult<DSpaceObject>> = new EventEmitter();

  /**
   * The initial pagination to use
   */
  initialPagination = Object.assign(new PaginationComponentOptions(), {
    id: 'spc',
    pageSize: 5,
  });

  /**
   * The current pagination options
   */
  currentPagination$: Observable<PaginationComponentOptions>;

  constructor(private router: Router,
              private searchConfigService: SearchConfigurationService,
              private paginationService: PaginationService,
  ) {
  }

  /**
   * Set up the selection and pagination on load
   */
  ngOnInit(): void {
    this.resetRoute();
    this.selectionRD$ = this.searchConfigService.paginatedSearchOptions
      .pipe(
        map((options: PaginatedSearchOptions) => options.pagination),
        switchMap((pagination: PaginationComponentOptions) => {
          return this.selection$.pipe(
            take(1),
            map((selected) => {
              const offset = (pagination.currentPage - 1) * pagination.pageSize;
              const end = (offset + pagination.pageSize) > selected.length ? selected.length : offset + pagination.pageSize;
              const selection = selected.slice(offset, end);
              const pageInfo = new PageInfo(
                {
                  elementsPerPage: pagination.pageSize,
                  totalElements: selected.length,
                  currentPage: pagination.currentPage,
                  totalPages: Math.ceil(selected.length / pagination.pageSize),
                });
              return createSuccessfulRemoteDataObject(buildPaginatedList(pageInfo, selection));
            }),
          );
        }),
      );
    this.currentPagination$ = this.paginationService.getCurrentPagination(this.searchConfigService.paginationID, this.initialPagination);
  }

  /**
   * Method to reset the route when the tab is opened to make sure no strange pagination issues appears
   */
  resetRoute() {
    this.paginationService.updateRoute(this.searchConfigService.paginationID, {
      page: 1,
      pageSize: 5,
    });
  }
}
