import { Component, Input, OnInit } from '@angular/core';
import { SearchOptions } from '../../../models/search-options.model';
import { SEARCH_CONFIG_SERVICE } from '../../../../../my-dspace-page/my-dspace-page.component';
import { SearchConfigurationService } from '../../../../../core/shared/search/search-configuration.service';
import { RemoteData } from '../../../../../core/data/remote-data';
import { BehaviorSubject, Observable } from 'rxjs';
import { getFirstCompletedRemoteData } from '../../../../../core/shared/operators';
import { SearchObjects } from '../../../models/search-objects.model';
import { DSpaceObject } from '../../../../../core/shared/dspace-object.model';
import { SearchManager } from '../../../../../core/browse/search-manager';
import { PaginationComponentOptions } from '../../../../pagination/pagination-component-options.model';
import { Context } from '../../../../../core/shared/context.model';
import { PaginationService } from '../../../../../core/pagination/pagination.service';
import { fadeIn } from '../../../../animations/fade';
import { PaginatedSearchOptions } from '../../../models/paginated-search-options.model';

@Component({
  selector: 'ds-item-export-list',
  templateUrl: './item-export-list.component.html',
  styleUrls: ['./item-export-list.component.scss'],
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService
    }
  ],
  animations: [fadeIn]
})
export class ItemExportListComponent implements OnInit {

  @Input() itemEntityType: string;
  @Input() listId: string;

  @Input() searchOptions: SearchOptions;

  /**
   * The configuration to use for the search options
   */
  configuration: string;

  /**
   * The current context
   * If empty, 'search' is used
   */
  context: Context = Context.Search;

  /**
   * The current pagination options
   */
  currentPagination$: Observable<PaginationComponentOptions>;

  /**
   * The initial pagination options
   */
  initialPagination: PaginationComponentOptions;

  /**
   * The displayed list of entries
   */
  resultsRD$: BehaviorSubject<RemoteData<SearchObjects<DSpaceObject>>> = new BehaviorSubject(null);

  constructor(
    private paginationService: PaginationService,
    private searchManager: SearchManager) {
  }

  ngOnInit(): void {
    this.initialPagination = Object.assign(new PaginationComponentOptions(), {
      id: 'el' + this.listId,
      pageSize: 10
    });
    this.configuration = this.searchOptions.configuration;
    this.currentPagination$ = this.paginationService.getCurrentPagination(this.initialPagination.id, this.initialPagination);
    this.currentPagination$.subscribe((paginationOptions: PaginationComponentOptions) => {
      this.searchOptions = Object.assign(new PaginatedSearchOptions({}), this.searchOptions, {
        fixedFilter: `f.entityType=${this.itemEntityType},equals`,
        pagination: paginationOptions
      });
      this.retrieveResultList(this.searchOptions);
    });
  }

  retrieveResultList(searchOptions: PaginatedSearchOptions): void {
    this.resultsRD$.next(null);
    this.searchManager.search(searchOptions).pipe(getFirstCompletedRemoteData())
      .subscribe((results: RemoteData<SearchObjects<DSpaceObject>>) => {
        this.resultsRD$.next(results);
      });
  }
}
