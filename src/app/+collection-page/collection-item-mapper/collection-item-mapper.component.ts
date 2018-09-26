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

  activeTab = 0;

  constructor(private collectionDataService: CollectionDataService,
              private route: ActivatedRoute,
              private router: Router,
              private searchConfigService: SearchConfigurationService,
              private searchService: SearchService) {
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
          dsoType: DSpaceObjectType.ITEM
        }));
      }),
      toDSpaceObjectListRD()
    );
    this.mappingItemsRD$ = this.searchOptions$.pipe(
      flatMap((options: PaginatedSearchOptions) => {
        return this.searchService.search(Object.assign(options, {
          dsoType: DSpaceObjectType.ITEM
        }));
      }),
      toDSpaceObjectListRD()
    );
  }

  getCurrentUrl(): string {
    const urlTree = this.router.parseUrl(this.router.url);
    const g: UrlSegmentGroup = urlTree.root.children[PRIMARY_OUTLET];
    return '/' + g.toString();
  }

}
