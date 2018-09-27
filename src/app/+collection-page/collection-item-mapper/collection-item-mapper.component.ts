import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { fadeIn, fadeInOut } from '../../shared/animations/fade';
import { CollectionDataService } from '../../core/data/collection-data.service';
import { ActivatedRoute, PRIMARY_OUTLET, Router, UrlSegmentGroup } from '@angular/router';
import { RemoteData } from '../../core/data/remote-data';
import { Observable } from 'rxjs/Observable';
import { Collection } from '../../core/shared/collection.model';
import { SearchConfigurationService } from '../../+search-page/search-service/search-configuration.service';
import { PaginatedSearchOptions } from '../../+search-page/paginated-search-options.model';
import { PaginatedList } from '../../core/data/paginated-list';
import { Item } from '../../core/shared/item.model';
import { combineLatest, flatMap, map, tap } from 'rxjs/operators';
import { getSucceededRemoteData, toDSpaceObjectListRD } from '../../core/shared/operators';
import { SearchService } from '../../+search-page/search-service/search.service';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { DSpaceObjectType } from '../../core/shared/dspace-object-type.model';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { ItemDataService } from '../../core/data/item-data.service';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Component({
  selector: 'ds-collection-item-mapper',
  styleUrls: ['./collection-item-mapper.component.scss'],
  templateUrl: './collection-item-mapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeIn,
    fadeInOut
  ]
})
export class CollectionItemMapperComponent implements OnInit {

  collectionRD$: Observable<RemoteData<Collection>>;
  searchOptions$: Observable<PaginatedSearchOptions>;
  collectionItemsRD$: Observable<RemoteData<PaginatedList<DSpaceObject>>>;
  mappingItemsRD$: Observable<RemoteData<PaginatedList<DSpaceObject>>>;

  defaultSortOptions: SortOptions = new SortOptions('dc.title', SortDirection.ASC);

  constructor(private route: ActivatedRoute,
              private router: Router,
              private searchConfigService: SearchConfigurationService,
              private searchService: SearchService,
              private notificationsService: NotificationsService,
              private itemDataService: ItemDataService) {
  }

  ngOnInit(): void {
    this.collectionRD$ = this.route.data.map((data) => data.collection);
    this.searchOptions$ = this.searchConfigService.paginatedSearchOptions;
    this.collectionItemsRD$ = this.collectionRD$.pipe(
      getSucceededRemoteData(),
      combineLatest(this.searchOptions$),
      flatMap(([collectionRD, options]) => {
        return this.searchService.search(Object.assign(options, {
          scope: collectionRD.payload.id,
          dsoType: DSpaceObjectType.ITEM,
          sort: this.defaultSortOptions
        }));
      }),
      toDSpaceObjectListRD()
    );
    this.mappingItemsRD$ = this.searchOptions$.pipe(
      flatMap((options: PaginatedSearchOptions) => {
        options.sort.field = 'dc.title';
        return this.searchService.search(Object.assign(options, {
          scope: undefined,
          dsoType: DSpaceObjectType.ITEM,
          sort: this.defaultSortOptions
        }));
      }),
      toDSpaceObjectListRD()
    );
  }

  mapItems(ids: string[]) {
    const responses = this.collectionRD$.pipe(
      map((collectionRD: RemoteData<Collection>) => collectionRD.payload),
      flatMap((collection: Collection) => forkJoin(ids.map((id: string) => this.itemDataService.mapToCollection(id, collection.id))))
    );

    responses.subscribe((value) => console.log(value));

    this.collectionRD$.subscribe((collectionRD: RemoteData<Collection>) => {
      this.notificationsService.success('Mapping completed', `Successfully mapped ${ids.length} items to collection "${collectionRD.payload.name}".`);
    });
  }

  getCurrentUrl(): string {
    const urlTree = this.router.parseUrl(this.router.url);
    const g: UrlSegmentGroup = urlTree.root.children[PRIMARY_OUTLET];
    return '/' + g.toString();
  }

}
