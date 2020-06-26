import { Component, OnInit, HostListener, ChangeDetectorRef, OnDestroy, Output, EventEmitter, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { hasValue } from '../empty.util';
import { map, mergeMap, startWith, debounceTime, distinctUntilChanged, switchMap, reduce } from 'rxjs/operators';
import { RemoteData } from 'src/app/core/data/remote-data';
import { FindListOptions } from 'src/app/core/data/request.models';
import { PaginatedList } from 'src/app/core/data/paginated-list';
import { Community } from 'src/app/core/shared/community.model';
import { CollectionDataService } from 'src/app/core/data/collection-data.service';
import { Collection } from '../../core/shared/collection.model';
import { followLink } from '../utils/follow-link-config.model';
import { getFirstSucceededRemoteDataPayload, getSucceededRemoteWithNotEmptyData } from '../../core/shared/operators';

/**
 * An interface to represent a collection entry
 */
interface CollectionListEntryItem {
  id: string;
  uuid: string;
  name: string;
}

/**
 * An interface to represent an entry in the collection list
 */
interface CollectionListEntry {
  communities: CollectionListEntryItem[],
  collection: CollectionListEntryItem
}

@Component({
  selector: 'ds-collection-dropdown',
  templateUrl: './collection-dropdown.component.html',
  styleUrls: ['./collection-dropdown.component.scss']
})
export class CollectionDropdownComponent implements OnInit, OnDestroy {

  /**
   * The search form control
   * @type {FormControl}
   */
  public searchField: FormControl = new FormControl();

  /**
   * The collection list obtained from a search
   * @type {Observable<CollectionListEntry[]>}
   */
  public searchListCollection$: Observable<CollectionListEntry[]>;

  /**
   * A boolean representing if dropdown list is scrollable to the bottom
   * @type {boolean}
   */
  private scrollableBottom = false;

  /**
   * A boolean representing if dropdown list is scrollable to the top
   * @type {boolean}
   */
  private scrollableTop = false;

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  public subs: Subscription[] = [];

  /**
   * The list of collection to render
   */
  searchListCollection: CollectionListEntry[] = [];

  @Output() selectionChange = new EventEmitter<CollectionListEntry>();
  /**
   * A boolean representing if the loader is visible or not
   */
  isLoadingList: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /**
   * A numeric representig current page
   */
  currentPage: number;

  /**
   * A boolean representing if exist another page to render
   */
  hasNextPage: boolean;

  /**
   * Current seach query used to filter collection list
   */
  currentQuery: string;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private collectionDataService: CollectionDataService,
    private el: ElementRef
  ) { }

  /**
   * Method called on mousewheel event, it prevent the page scroll
   * when arriving at the top/bottom of dropdown menu
   *
   * @param event
   *     mousewheel event
   */
  @HostListener('mousewheel', ['$event']) onMousewheel(event) {
    if (event.wheelDelta > 0 && this.scrollableTop) {
      event.preventDefault();
    }
    if (event.wheelDelta < 0 && this.scrollableBottom) {
      event.preventDefault();
    }
  }

  /**
   * Initialize collection list
   */
  ngOnInit() {
    this.subs.push(this.searchField.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        startWith('')
      ).subscribe(
        (next) => {
          if (hasValue(next) && next !== this.currentQuery) {
            this.resetPagination();
            this.currentQuery = next;
            this.populateCollectionList(this.currentQuery, this.currentPage);
          }
        }
      ));
    // Workaround for prevent the scroll of main page when this component is placed in a dialog
    setTimeout(() => this.el.nativeElement.querySelector('input').focus(), 0);
  }

  /**
   * Check if dropdown scrollbar is at the top or bottom of the dropdown list
   *
   * @param event
   */
  onScroll(event) {
    this.scrollableBottom = (event.target.scrollTop + event.target.clientHeight === event.target.scrollHeight);
    this.scrollableTop = (event.target.scrollTop === 0);
  }

  /**
   * Method used from infitity scroll for retrive more data on scroll down
   */
  onScrollDown() {
    if ( this.hasNextPage ) {
      this.populateCollectionList(this.currentQuery, ++this.currentPage);
    }
  }

  /**
   * Emit a [selectionChange] event when a new collection is selected from list
   *
   * @param event
   *    the selected [CollectionListEntry]
   */
  onSelect(event: CollectionListEntry) {
    this.selectionChange.emit(event);
  }

  /**
   * Method called for populate the collection list
   * @param query text for filter the collection list
   * @param page page number
   */
  populateCollectionList(query: string, page: number) {
    this.isLoadingList.next(true);
    // Set the pagination info
    const findOptions: FindListOptions = {
      elementsPerPage: 10,
      currentPage: page
    };
    this.searchListCollection$ = this.collectionDataService
      .getAuthorizedCollection(query, findOptions, followLink('parentCommunity'))
      .pipe(
        getSucceededRemoteWithNotEmptyData(),
        switchMap((collections: RemoteData<PaginatedList<Collection>>) => {
          if ( (this.searchListCollection.length + findOptions.elementsPerPage) >= collections.payload.totalElements ) {
            this.hasNextPage = false;
          }
          return collections.payload.page;
        }),
        mergeMap((collection: Collection) => collection.parentCommunity.pipe(
          getFirstSucceededRemoteDataPayload(),
          map((community: Community) => ({
            communities: [{ id: community.id, name: community.name }],
            collection: { id: collection.id, uuid: collection.id, name: collection.name }
          })
        ))),
        reduce((acc: any, value: any) => [...acc, ...value], []),
        startWith([])
        );
    this.subs.push(this.searchListCollection$.subscribe(
      (next) => { this.searchListCollection.push(...next); }, undefined,
      () => { this.hideShowLoader(false); this.changeDetectorRef.detectChanges(); }
    ));
  }

  /**
   * Unsubscribe from all subscriptions
   */
  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

  /**
   * Reset search form control
   */
  reset() {
    this.searchField.setValue('');
  }

  /**
   * Reset pagination values
   */
  resetPagination() {
    this.currentPage = 1;
    this.currentQuery = '';
    this.hasNextPage = true;
    this.searchListCollection = [];
  }

  /**
   * Hide/Show the collection list loader
   * @param hideShow true for show, false otherwise
   */
  hideShowLoader(hideShow: boolean) {
    this.isLoadingList.next(hideShow);
  }
}
