import { KeyValue } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map, switchMap } from 'rxjs';
import { CollectionPageComponent as BaseComponent } from '../../../../app/collection-page/collection-page.component';
import { AuthService } from '../../../../app/core/auth/auth.service';
import { DSONameService } from '../../../../app/core/breadcrumbs/dso-name.service';
import { SortDirection, SortOptions } from '../../../../app/core/cache/models/sort-options.model';
import { CollectionDataService } from '../../../../app/core/data/collection-data.service';
import { AuthorizationDataService } from '../../../../app/core/data/feature-authorization/authorization-data.service';
import { PaginatedList } from '../../../../app/core/data/paginated-list.model';
import { RemoteData } from '../../../../app/core/data/remote-data';
import { PaginationService } from '../../../../app/core/pagination/pagination.service';
import { DSpaceObjectType } from '../../../../app/core/shared/dspace-object-type.model';
import { Item } from '../../../../app/core/shared/item.model';
import { getFirstSucceededRemoteData, toDSpaceObjectListRD } from '../../../../app/core/shared/operators';
import { SearchService } from '../../../../app/core/shared/search/search.service';
import { fadeIn, fadeInOut } from '../../../../app/shared/animations/fade';
import { PaginationComponentOptions } from '../../../../app/shared/pagination/pagination-component-options.model';
import { PaginatedSearchOptions } from '../../../../app/shared/search/models/paginated-search-options.model';
import { APP_CONFIG, AppConfig } from '../../../../config/app-config.interface';

const regex = /^.*Volume (\d?\d?), Numbers? (.*) \(Complete\)$/;

interface Volume {
  uuid: string;
  number: number;
  issue: string;
  year: string;
  series: string;
}

@Component({
  selector: 'ds-collection-page',
  templateUrl: './collection-page.component.html',
  // templateUrl: '../../../../app/collection-page/collection-page.component.html',
  // styleUrls: ['./collection-page.component.scss']
  styleUrls: ['../../../../app/collection-page/collection-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeIn,
    fadeInOut
  ]
})
/**
 * This component represents a detail page for a single collection
 */
export class CollectionPageComponent extends BaseComponent {

  private _searchService: SearchService;

  public volumes: Observable<Map<number, Volume[]>>;

  constructor(
    collectionDataService: CollectionDataService,
    searchService: SearchService,
    route: ActivatedRoute,
    router: Router,
    authService: AuthService,
    paginationService: PaginationService,
    authorizationDataService: AuthorizationDataService,
    public dsoNameService: DSONameService,
    @Inject(APP_CONFIG) public appConfig: AppConfig,
  ) {
    super(collectionDataService,
      searchService,
      route,
      router,
      authService,
      paginationService,
      authorizationDataService,
      dsoNameService,
      appConfig);
    this._searchService = searchService;
  }

  ngOnInit(): void {
    super.ngOnInit();

    const pagination = Object.assign(new PaginationComponentOptions(), {
      id: 'cp',
      currentPage: 1,
      pageSize: 1000,
    });

    const sort = new SortOptions('dc.date.accessioned', SortDirection.DESC);

    this.volumes = this.fetchCompleteItems(pagination, sort)
      .pipe(map(((data: RemoteData<PaginatedList<Item>>) => {
        const volumes = new Map<number, Volume[]>();
        data.payload.page.forEach((item) => {
          const inSeries = item.metadata['dc.relation.ispartofseries'];
          const title = item.metadata['dc.title'];
          if (!!inSeries && inSeries.length > 0 && !!inSeries[0].value && !!title && title.length > 0 && !!title[0].value) {
            const matches = regex.exec(title[0].value);
            if (!!matches && matches.length > 2) {
              const volume = Number(matches[1]);
              const issue = matches[2].replace(/ /g, '').replace(/&/g, ' & ');
              const list = volumes.has(volume) ? volumes.get(volume) : [];
              const dateIssued = item.metadata['dc.date.issued'];
              const year = !!dateIssued && dateIssued.length > 0 && !!dateIssued[0].value ? dateIssued[0].value : 'Unknown';
              const series = `dc.relation.ispartofseries:"${inSeries[0].value}"`;

              list.push({ uuid: item.uuid, number: Number(volume), issue, year, series });

              volumes.set(volume, list.sort((a, b) => (a.issue < b.issue) ? 1 : -1));
            }
          }
        });

        return volumes;
      })));
  }

  public sortByKeyDescOrder(a: KeyValue<string, Volume[]>, b: KeyValue<string, Volume[]>): number {
    return a.key > b.key ? -1 : (b.key > a.key ? 1 : 0);
  }

  public trackByIndex = (index: number): number => {
    return index;
  };

  private fetchCompleteItems(pagination: PaginationComponentOptions, sort: SortOptions): Observable<RemoteData<PaginatedList<Item>>> {
    return this.collectionRD$.pipe(
      getFirstSucceededRemoteData(),
      map((rd) => rd.payload.id),
      switchMap((id: string) => {
        const filters = [{
          key: 'f.title',
          values: ['Volume', 'Number', '(Complete)'],
          operator: 'contains'
        }];
        return this._searchService.search<Item>(
          new PaginatedSearchOptions({
            scope: id,
            dsoTypes: [DSpaceObjectType.ITEM],
            pagination,
            sort,
            filters,
          }), null, true, true)
          .pipe(toDSpaceObjectListRD()) as Observable<RemoteData<PaginatedList<Item>>>;
      }));
  }

}
