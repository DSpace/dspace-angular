import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, of as observableOf, Observable, Subject } from 'rxjs';
import { filter, flatMap, map, startWith, switchMap, take, tap } from 'rxjs/operators';
import { PaginatedSearchOptions } from '../shared/search/paginated-search-options.model';
import { SearchService } from '../core/shared/search/search.service';
import { SortDirection, SortOptions } from '../core/cache/models/sort-options.model';
import { CollectionDataService } from '../core/data/collection-data.service';
import { PaginatedList } from '../core/data/paginated-list';
import { RemoteData } from '../core/data/remote-data';

import { MetadataService } from '../core/metadata/metadata.service';
import { Bitstream } from '../core/shared/bitstream.model';

import { Collection } from '../core/shared/collection.model';
import { DSpaceObjectType } from '../core/shared/dspace-object-type.model';
import { Item } from '../core/shared/item.model';
import {
  getSucceededRemoteData,
  redirectOn4xx,
  toDSpaceObjectListRD
} from '../core/shared/operators';

import { fadeIn, fadeInOut } from '../shared/animations/fade';
import { hasNoValue, hasValue, isNotEmpty } from '../shared/empty.util';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { AuthService } from '../core/auth/auth.service';
import { getBulkImportRoute } from '../app-routing-paths';
import { AuthorizationDataService } from '../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../core/data/feature-authorization/feature-id';
import { ScriptDataService } from '../core/data/processes/script-data.service';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { RequestEntry } from '../core/data/request.reducer';
import { ProcessParameter } from '../process-page/processes/process-parameter.model';
import { TranslateService } from '@ngx-translate/core';
import { RequestService } from '../core/data/request.service';

@Component({
  selector: 'ds-collection-page',
  styleUrls: ['./collection-page.component.scss'],
  templateUrl: './collection-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeIn,
    fadeInOut
  ]
})
export class CollectionPageComponent implements OnInit {
  collectionRD$: Observable<RemoteData<Collection>>;
  itemRD$: Observable<RemoteData<PaginatedList<Item>>>;
  logoRD$: Observable<RemoteData<Bitstream>>;
  paginationConfig: PaginationComponentOptions;
  sortConfig: SortOptions;
  private paginationChanges$: Subject<{
    paginationConfig: PaginationComponentOptions,
    sortConfig: SortOptions
  }>;

  constructor(
    private collectionDataService: CollectionDataService,
    private searchService: SearchService,
    private metadata: MetadataService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private authorizationService: AuthorizationDataService,
    private scriptService: ScriptDataService,
    private translationService: TranslateService,
    private requestService: RequestService,
    private notificationsService: NotificationsService
  ) {
    this.paginationConfig = new PaginationComponentOptions();
    this.paginationConfig.id = 'collection-page-pagination';
    this.paginationConfig.pageSize = 5;
    this.paginationConfig.currentPage = 1;
    this.sortConfig = new SortOptions('dc.date.accessioned', SortDirection.DESC);
  }

  ngOnInit(): void {
    this.collectionRD$ = this.route.data.pipe(
      map((data) => data.dso as RemoteData<Collection>),
      redirectOn4xx(this.router, this.authService),
      take(1)
    );
    this.logoRD$ = this.collectionRD$.pipe(
      map((rd: RemoteData<Collection>) => rd.payload),
      filter((collection: Collection) => hasValue(collection)),
      flatMap((collection: Collection) => collection.logo)
    );

    this.paginationChanges$ = new BehaviorSubject({
      paginationConfig: this.paginationConfig,
      sortConfig: this.sortConfig
    });

    this.itemRD$ = this.paginationChanges$.pipe(
      switchMap((dto) => this.collectionRD$.pipe(
        getSucceededRemoteData(),
        map((rd) => rd.payload.id),
        switchMap((id: string) => {
          return this.searchService.search(
              new PaginatedSearchOptions({
                scope: id,
                pagination: dto.paginationConfig,
                sort: dto.sortConfig,
                dsoTypes: [DSpaceObjectType.ITEM]
              })).pipe(toDSpaceObjectListRD()) as Observable<RemoteData<PaginatedList<Item>>>
        }),
        startWith(undefined) // Make sure switching pages shows loading component
        )
      )
    );

    this.route.queryParams.pipe(take(1)).subscribe((params) => {
      this.metadata.processRemoteData(this.collectionRD$);
      this.onPaginationChange(params);
    })
  }

  isNotEmpty(object: any) {
    return isNotEmpty(object);
  }

  onPaginationChange(event) {
    this.paginationConfig.currentPage = +event.page || this.paginationConfig.currentPage;
    this.paginationConfig.pageSize = +event.pageSize || this.paginationConfig.pageSize;
    this.sortConfig.direction = event.sortDirection || this.sortConfig.direction;
    this.sortConfig.field = event.sortField || this.sortConfig.field;

    this.paginationChanges$.next({
      paginationConfig: this.paginationConfig,
      sortConfig: this.sortConfig
    });
  }

  exportCollection(collection: Collection) {

    const stringParameters: ProcessParameter[] = [
      { name: '-c', value: collection.id }
    ];

    this.scriptService.invoke('collection-export', stringParameters, [])
      .pipe(take(1))
      .subscribe((requestEntry: RequestEntry) => {
        if (requestEntry.response.isSuccessful) {
          this.notificationsService.success(this.translationService.get('collection-export.success'));
          this.navigateToProcesses();
        } else {
          this.notificationsService.error(this.translationService.get('collection-export.error'));
        }
      })
  }

  private navigateToProcesses() {
    this.requestService.removeByHrefSubstring('/processes');
    this.router.navigateByUrl('/processes');
  }

  getBulkImportPageRouterLink(collection: Collection) {
    return getBulkImportRoute(collection);
  }

  isCollectionAdmin(collection: Collection): Observable<boolean> {
    return this.authorizationService.isAuthorized(FeatureID.AdministratorOf, collection.self, undefined);
  }
}
