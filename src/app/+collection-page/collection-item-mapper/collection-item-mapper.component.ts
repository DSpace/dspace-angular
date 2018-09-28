import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { fadeIn, fadeInOut } from '../../shared/animations/fade';
import { ActivatedRoute, PRIMARY_OUTLET, Router, UrlSegmentGroup } from '@angular/router';
import { RemoteData } from '../../core/data/remote-data';
import { Observable } from 'rxjs/Observable';
import { Collection } from '../../core/shared/collection.model';
import { SearchConfigurationService } from '../../+search-page/search-service/search-configuration.service';
import { PaginatedSearchOptions } from '../../+search-page/paginated-search-options.model';
import { PaginatedList } from '../../core/data/paginated-list';
import { flatMap, map, switchMap } from 'rxjs/operators';
import { getSucceededRemoteData, toDSpaceObjectListRD } from '../../core/shared/operators';
import { SearchService } from '../../+search-page/search-service/search.service';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { DSpaceObjectType } from '../../core/shared/dspace-object-type.model';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { ItemDataService } from '../../core/data/item-data.service';
import { RestResponse } from '../../core/cache/response-cache.models';
import { TranslateService } from '@ngx-translate/core';

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
              private itemDataService: ItemDataService,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.collectionRD$ = this.route.data.map((data) => data.collection).pipe(getSucceededRemoteData()) as Observable<RemoteData<Collection>>;
    this.searchOptions$ = this.searchConfigService.paginatedSearchOptions;
    this.loadItemLists();
  }

  loadItemLists() {
    const collectionAndOptions$ = Observable.combineLatest(
      this.collectionRD$,
      this.searchOptions$
    );
    this.collectionItemsRD$ = collectionAndOptions$.pipe(
      switchMap(([collectionRD, options]) => {
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
    const responses$ = this.collectionRD$.pipe(
      getSucceededRemoteData(),
      map((collectionRD: RemoteData<Collection>) => collectionRD.payload.id),
      switchMap((collectionId: string) => Observable.combineLatest(ids.map((id: string) => this.itemDataService.mapToCollection(id, collectionId))))
    );

    responses$.subscribe((responses: RestResponse[]) => {
      const successful = responses.filter((response: RestResponse) => response.isSuccessful);
      const unsuccessful = responses.filter((response: RestResponse) => !response.isSuccessful);
      if (successful.length > 0) {
        const successMessages = Observable.combineLatest(
          this.translateService.get('collection.item-mapper.notifications.success.head'),
          this.translateService.get('collection.item-mapper.notifications.success.content', { amount: successful.length })
        );

        successMessages.subscribe(([head, content]) => {
          this.notificationsService.success(head, content);
        });
      }
      if (unsuccessful.length > 0) {
        const unsuccessMessages = Observable.combineLatest(
          this.translateService.get('collection.item-mapper.notifications.error.head'),
          this.translateService.get('collection.item-mapper.notifications.error.content', { amount: unsuccessful.length })
        );

        unsuccessMessages.subscribe(([head, content]) => {
          this.notificationsService.error(head, content);
        });
      }
    });
  }

  tabChange(event) {
    // TODO: Fix tabs to maintain their own pagination options (once the current pagination system is improved)
    // Temporary solution: Clear url params when changing tabs
    if (this.router.url.indexOf('?') > -1) {
      const url: string = this.router.url.substring(0, this.router.url.indexOf('?'));
      this.router.navigateByUrl(url);
    }
  }

  getCurrentUrl(): string {
    const urlTree = this.router.parseUrl(this.router.url);
    const g: UrlSegmentGroup = urlTree.root.children[PRIMARY_OUTLET];
    return '/' + g.toString();
  }

}
