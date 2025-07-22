import { AsyncPipe } from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

import { AuthService } from '../../../../../../src/app/core/auth/auth.service';
import { DSONameService } from '../../../../../../src/app/core/breadcrumbs/dso-name.service';
import { getBrowseLinksToFollow } from '../../../../../../src/app/core/browse/browse.service';
import { SortDirection, SortOptions } from '../../../../../../src/app/core/cache/models/sort-options.model';
import { PaginatedList } from '../../../../../../src/app/core/data/paginated-list.model';
import { PaginationService } from '../../../../../../src/app/core/pagination/pagination.service';
import { Collection } from '../../../../../../src/app/core/shared/collection.model';
import { DSpaceObjectType } from '../../../../../../src/app/core/shared/dspace-object-type.model';
import { Item } from '../../../../../../src/app/core/shared/item.model';
import { toDSpaceObjectListRD } from '../../../../../../src/app/core/shared/operators';
import { SearchService } from '../../../../../../src/app/core/shared/search/search.service';
import { fadeIn, fadeInOut } from '../../../../../../src/app/shared/animations/fade';
import { ErrorComponent } from '../../../../../../src/app/shared/error/error.component';
import { ThemedLoadingComponent } from '../../../../../../src/app/shared/loading/themed-loading.component';
import { ObjectGridComponent } from '../../../../../../src/app/shared/object-grid/object-grid.component';
import { PaginationComponentOptions } from '../../../../../../src/app/shared/pagination/pagination-component-options.model';
import { PaginatedSearchOptions } from '../../../../../../src/app/shared/search/models/paginated-search-options.model';
import { VarDirective } from '../../../../../../src/app/shared/utils/var.directive';
import {
  APP_CONFIG,
  AppConfig,
} from '../../../../../config/app-config.interface';
import { RemoteData } from '../../../../core/data/remote-data';
import { SearchConfigurationService } from '../../../../core/shared/search/search-configuration.service';
import { SEARCH_CONFIG_SERVICE } from '../../../../my-dspace-page/my-dspace-configuration.service';

/**
 * The recent tab on community & collection pages
 */
@Component({
  selector: 'ds-comcol-recent-section',
  templateUrl: './comcol-recent-section.component.html',
  styleUrls: ['./comcol-recent-section.component.scss'],
  providers: [
    {
      provide: SEARCH_CONFIG_SERVICE,
      useClass: SearchConfigurationService,
    },
  ],
  imports: [
    AsyncPipe,
    ErrorComponent,
    ObjectGridComponent,
    ThemedLoadingComponent,
    TranslateModule,
    VarDirective
  ],
  animations: [
    fadeIn,
    fadeInOut
  ],
  standalone: true,
})
export class ComcolRecentSectionComponent implements OnInit {

  collectionRD$: Observable<RemoteData<Collection>>;

  itemRD$: Observable<RemoteData<PaginatedList<Item>>>;

  paginationConfig: PaginationComponentOptions;

  sortConfig: SortOptions;

  private paginationChanges$: Subject<{
    paginationConfig: PaginationComponentOptions,
    sortConfig: SortOptions
  }>;

  constructor(
    private readonly searchService: SearchService,
    private readonly paginationService: PaginationService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService,
    public dsoNameService: DSONameService,
    @Inject(APP_CONFIG) public appConfig: AppConfig,
  ) {
    this.paginationConfig = Object.assign(new PaginationComponentOptions(), {
      id: 'cp',
      currentPage: 1,
      pageSize: this.appConfig.browseBy.pageSize,
    });

    this.sortConfig = new SortOptions('dc.date.accessioned', SortDirection.DESC);
  }

  ngOnInit(): void {
    this.paginationChanges$ = new BehaviorSubject({
      paginationConfig: this.paginationConfig,
      sortConfig: this.sortConfig
    });

    const currentPagination$ = this.paginationService.getCurrentPagination(this.paginationConfig.id, this.paginationConfig);
    const currentSort$ = this.paginationService.getCurrentSort(this.paginationConfig.id, this.sortConfig);

    const id = this.router.routerState.snapshot.url.split('/')[2];

    this.itemRD$ = combineLatest([currentPagination$, currentSort$]).pipe(
      switchMap(([currentPagination, currentSort]) => {
          return this.searchService.search<Item>(
            new PaginatedSearchOptions({
              scope: id,
              pagination: currentPagination,
              sort: currentSort,
              dsoTypes: [DSpaceObjectType.ITEM]
            }), null, true, true, ...getBrowseLinksToFollow())
            .pipe(toDSpaceObjectListRD()) as Observable<RemoteData<PaginatedList<Item>>>;
        }),
        startWith(undefined) // Make sure switching pages shows loading component
    );
  }

  ngOnDestroy(): void {
    this.paginationService.clearPagination(this.paginationConfig.id);
  }

}
