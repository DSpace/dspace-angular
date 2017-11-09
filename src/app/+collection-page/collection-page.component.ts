import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Subscription } from 'rxjs/Subscription';
import { SortOptions } from '../core/cache/models/sort-options.model';
import { CollectionDataService } from '../core/data/collection-data.service';
import { ItemDataService } from '../core/data/item-data.service';
import { RemoteData } from '../core/data/remote-data';

import { MetadataService } from '../core/metadata/metadata.service';
import { Bitstream } from '../core/shared/bitstream.model';

import { Collection } from '../core/shared/collection.model';
import { Item } from '../core/shared/item.model';

import { fadeIn, fadeInOut } from '../shared/animations/fade';
import { hasValue, isNotEmpty } from '../shared/empty.util';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';

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
export class CollectionPageComponent implements OnInit, OnDestroy {
  collectionRDObs: Observable<RemoteData<Collection>>;
  itemRDObs: Observable<RemoteData<Item[]>>;
  logoRDObs: Observable<RemoteData<Bitstream>>;
  paginationConfig: PaginationComponentOptions;
  sortConfig: SortOptions;
  private subs: Subscription[] = [];
  private collectionId: string;

  constructor(
    private collectionDataService: CollectionDataService,
    private itemDataService: ItemDataService,
    private metadata: MetadataService,
    private route: ActivatedRoute
  ) {
    this.paginationConfig = new PaginationComponentOptions();
    this.paginationConfig.id = 'collection-page-pagination';
    this.paginationConfig.pageSize = 5;
    this.paginationConfig.currentPage = 1;
    this.sortConfig = new SortOptions();
  }

  ngOnInit(): void {
    this.subs.push(
      Observable.combineLatest(
        this.route.params,
        this.route.queryParams,
        (params, queryParams, ) => {
          return Object.assign({}, params, queryParams);
        })
        .subscribe((params) => {
          this.collectionId = params.id;
          this.collectionRDObs = this.collectionDataService.findById(this.collectionId);
          this.metadata.processRemoteData(this.collectionRDObs);
          this.subs.push(this.collectionRDObs
            .map((rd: RemoteData<Collection>) => rd.payload)
            .filter((collection: Collection) => hasValue(collection))
            .subscribe((collection: Collection) => this.logoRDObs = collection.logo));

          const page = +params.page || this.paginationConfig.currentPage;
          const pageSize = +params.pageSize || this.paginationConfig.pageSize;
          const sortDirection = +params.page || this.sortConfig.direction;
          const pagination = Object.assign({},
            this.paginationConfig,
            { currentPage: page, pageSize: pageSize }
          );
          const sort = Object.assign({},
            this.sortConfig,
            { direction: sortDirection, field: params.sortField }
          );
          this.updatePage({
            pagination: pagination,
            sort: sort
          });
        }));

  }

  updatePage(searchOptions) {
    this.itemRDObs = this.itemDataService.findAll({
      scopeID: this.collectionId,
      currentPage: searchOptions.pagination.currentPage,
      elementsPerPage: searchOptions.pagination.pageSize,
      sort: searchOptions.sort
    });
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

  isNotEmpty(object: any) {
    return isNotEmpty(object);
  }

  onPaginationChange(event) {
    this.updatePage({
      pagination: {
        currentPage: event.page,
        pageSize: event.pageSize
      },
      sort: {
        field: event.sortField,
        direction: event.sortDirection
      }
    })
  }
}
