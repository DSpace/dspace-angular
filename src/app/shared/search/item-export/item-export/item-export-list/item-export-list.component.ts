import { AsyncPipe } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { SearchManager } from '@dspace/core/browse/search-manager';
import { RemoteData } from '@dspace/core/data/remote-data';
import { PaginationService } from '@dspace/core/pagination/pagination.service';
import { PaginationComponentOptions } from '@dspace/core/pagination/pagination-component-options.model';
import { Context } from '@dspace/core/shared/context.model';
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import { PaginatedSearchOptions } from '@dspace/core/shared/search/models/paginated-search-options.model';
import { SearchObjects } from '@dspace/core/shared/search/models/search-objects.model';
import { SearchOptions } from '@dspace/core/shared/search/models/search-options.model';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  Observable,
} from 'rxjs';

import { SEARCH_CONFIG_SERVICE } from '../../../../../my-dspace-page/my-dspace-configuration.service';
import { fadeIn } from '../../../../animations/fade';
import { ErrorComponent } from '../../../../error/error.component';
import { ThemedLoadingComponent } from '../../../../loading/themed-loading.component';
import { ObjectCollectionComponent } from '../../../../object-collection/object-collection.component';
import { VarDirective } from '../../../../utils/var.directive';
import { SearchConfigurationService } from '../../../search-configuration.service';

@Component({
  selector: 'ds-item-export-list',
  templateUrl: './item-export-list.component.html',
  styleUrls: ['./item-export-list.component.scss'],
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService,
    },
  ],
  animations: [fadeIn],
  imports: [
    AsyncPipe,
    ErrorComponent,
    ObjectCollectionComponent,
    ThemedLoadingComponent,
    TranslateModule,
    VarDirective,
  ],
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
      pageSize: 10,
    });
    this.configuration = this.searchOptions.configuration;
    this.currentPagination$ = this.paginationService.getCurrentPagination(this.initialPagination.id, this.initialPagination);
    this.currentPagination$.subscribe((paginationOptions: PaginationComponentOptions) => {
      this.searchOptions = Object.assign(new PaginatedSearchOptions({}), this.searchOptions, {
        fixedFilter: `f.entityType=${this.itemEntityType},equals`,
        pagination: paginationOptions,
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
