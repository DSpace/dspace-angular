import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CollectionDataService } from '@dspace/core/data/collection-data.service';
import { FindListOptions } from '@dspace/core/data/find-list-options.model';
import { PaginatedList } from '@dspace/core/data/paginated-list.model';
import { DynamicLayoutBox } from '@dspace/core/layout/models/box.model';
import { Collection } from '@dspace/core/shared/collection.model';
import { Item } from '@dspace/core/shared/item.model';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteDataPayload,
  getPaginatedListPayload,
} from '@dspace/core/shared/operators';
import { hasValue } from '@dspace/shared/utils/empty.util';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
} from 'rxjs';
import {
  map,
  shareReplay,
  tap,
} from 'rxjs/operators';

import { environment } from '../../../../../../environments/environment';
import { DynamicLayoutBoxModelComponent } from '../../../../models/dynamic-layout-box-component.model';

@Component({
  selector: 'ds-dynamic-layout-collection-box',
  templateUrl: './dynamic-layout-collection-box.component.html',
  styleUrls: ['./dynamic-layout-collection-box.component.scss'],
  imports: [
    AsyncPipe,
    NgClass,
    RouterLink,
    TranslateModule,
  ],
})
export class DynamicLayoutCollectionBoxComponent extends DynamicLayoutBoxModelComponent implements OnInit {

  isInline = environment.layout.collectionsBox.isInline;

  /**
   * Amount of mapped collections that should be fetched at once.
   */
  pageSize = 5;

  /**
    * Last page of the mapped collections that has been fetched.
    */
  lastPage = 0;

  /**
   * Whether or not a page of mapped collections is currently being loaded.
   */
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  /**
   * Whether or not more pages of mapped collections are available.
   */
  hasMore$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  /**
   * This includes the owning collection
   */
  owningCollection$: Observable<Collection>;

  /**
    * This includes the mapped collection
    */
  mappedCollections$: Observable<Collection[]> = of([]);

  constructor(
    protected translateService: TranslateService,
    @Inject('boxProvider') public boxProvider: DynamicLayoutBox,
    @Inject('itemProvider') public itemProvider: Item,
    private cds: CollectionDataService,
  ) {
    super(translateService, boxProvider, itemProvider);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.owningCollection$ = this.item.owningCollection.pipe(
      getFirstSucceededRemoteDataPayload(),
      shareReplay({ refCount: false, bufferSize: 1 }),
    );

    this.handleLoadMore();
  }

  handleLoadMore() {
    this.isLoading$.next(true);
    const newMappedCollections$ = this.loadMappedCollectionPage();
    this.mappedCollections$ = combineLatest([this.mappedCollections$, newMappedCollections$]).pipe(
      map(([mappedCollections, newMappedCollections]: [Collection[], Collection[]]) => {
        return [...mappedCollections, ...newMappedCollections].filter(collection => hasValue(collection));
      }),
    );
  }

  loadMappedCollectionPage(): Observable<Collection[]> {
    return this.cds.findMappedCollectionsFor(this.item, Object.assign(new FindListOptions(), {
      elementsPerPage: this.pageSize,
      currentPage: this.lastPage + 1,
    })).pipe(
      getFirstCompletedRemoteData<PaginatedList<Collection>>(),

      // update isLoading$
      tap(() => this.isLoading$.next(false)),

      getFirstSucceededRemoteDataPayload(),

      // update lastPage
      tap((response: PaginatedList<Collection>) => this.lastPage = response.currentPage),

      // update hasMore$
      tap((response: PaginatedList<Collection>) => this.hasMore$.next(this.lastPage < response.totalPages)),

      getPaginatedListPayload<Collection>(),
    );
  }

  /**
   * Returns a string representing the style of field label if exists
   */
  get labelStyle(): string {
    return environment.layout.collectionsBox.defaultCollectionsLabelColStyle;
  }

  /**
   * Returns a string representing the style of field value if exists
   */
  get valueStyle(): string {
    return environment.layout.collectionsBox.defaultCollectionsValueColStyle;
  }

  /**
   * Returns a string representing the style of row if exists
   */
  get rowStyle(): string {
    return environment.layout.collectionsBox.defaultCollectionsRowStyle;
  }

}
