import { Component, Inject, OnInit } from '@angular/core';
import { CrisLayoutBoxModelComponent } from '../../../../models/cris-layout-box-component.model';
import { CrisLayoutBox } from '../../../../../core/layout/models/box.model';
import { Item } from '../../../../../core/shared/item.model';
import { TranslateService } from '@ngx-translate/core';
import { RenderCrisLayoutBoxFor } from '../../../../decorators/cris-layout-box.decorator';
import { LayoutBox } from '../../../../enums/layout-box.enum';
import { BehaviorSubject, Observable } from 'rxjs';
import { getFirstSucceededRemoteDataPayload, getAllCompletedRemoteData, getAllSucceededRemoteDataPayload, getPaginatedListPayload } from '../../../../../core/shared/operators';
import { startWith, tap, withLatestFrom, switchMap, scan } from 'rxjs/operators';
import { Collection } from '../../../../../core/shared/collection.model';
import { CollectionDataService } from '../../../../../core/data/collection-data.service';
import { FindListOptions } from '../../../../../core/data/request.models';
import { PaginatedList } from '../../../../../core/data/paginated-list.model';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'ds-cris-layout-collection-box',
  templateUrl: './cris-layout-collection-box.component.html',
  styleUrls: ['./cris-layout-collection-box.component.scss']
})
@RenderCrisLayoutBoxFor(LayoutBox.COLLECTIONS)
export class CrisLayoutCollectionBoxComponent extends CrisLayoutBoxModelComponent implements OnInit {

  separator = '<br/>';

  /**
   * Amount of mapped collections that should be fetched at once.
   */
  pageSize = 5;

   /**
    * Last page of the mapped collections that has been fetched.
    */
  lastPage$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  /**
   * Push an event to this observable to fetch the next page of mapped collections.
   * Because this observable is a behavior subject, the first page will be requested
   * immediately after subscription.
   */
  loadMore$: BehaviorSubject<void> = new BehaviorSubject(undefined);

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
  mappedCollections$: Observable<Collection[]>;

  constructor(
    protected translateService: TranslateService,
    @Inject('boxProvider') public boxProvider: CrisLayoutBox,
    @Inject('itemProvider') public itemProvider: Item,
    private cds: CollectionDataService
  ) {
    super(translateService, boxProvider, itemProvider);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.owningCollection$ = this.cds.findOwningCollectionFor(this.item).pipe(
      getFirstSucceededRemoteDataPayload(),
      startWith(null as Collection),
    );

    this.mappedCollections$ = this.loadMore$.pipe(
      // update isLoading$
      tap(() => this.isLoading$.next(true)),

      // request next batch of mapped collections
      withLatestFrom(this.lastPage$),
      switchMap(([_, lastPage]: [void, number]) => {
        return this.cds.findMappedCollectionsFor(this.item, Object.assign(new FindListOptions(), {
          elementsPerPage: this.pageSize,
          currentPage: lastPage + 1,
        }));
      }),

      getAllCompletedRemoteData<PaginatedList<Collection>>(),

      // update isLoading$
      tap(() => this.isLoading$.next(false)),

      getAllSucceededRemoteDataPayload(),

      // update hasMore$
      tap((response: PaginatedList<Collection>) => this.hasMore$.next(response.currentPage < response.totalPages)),

      // update lastPage$
      tap((response: PaginatedList<Collection>) => this.lastPage$.next(response.currentPage)),

      getPaginatedListPayload<Collection>(),

      // add current batch to list of collections
      scan((prev: Collection[], current: Collection[]) => [...prev, ...current], []),

      startWith([]),
    ) as Observable<Collection[]>;
  }

  handleLoadMore() {
    this.loadMore$.next();
  }

  /**
   * Returns a string representing the style of field label if exists
   */
  get labelStyle(): string {
    return environment.crisLayout.collectionsBox.defaultCollectionsLabelColStyle;
  }

  /**
   * Returns a string representing the style of field value if exists
   */
  get valueStyle(): string {
    return environment.crisLayout.collectionsBox.defaultCollectionsValueColStyle;
  }


}
