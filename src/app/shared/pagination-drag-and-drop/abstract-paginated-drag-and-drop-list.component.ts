import { FieldUpdates } from '../../core/data/object-updates/object-updates.reducer';
import { Observable } from 'rxjs/internal/Observable';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list';
import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ObjectUpdatesService } from '../../core/data/object-updates/object-updates.service';
import { switchMap, tap } from 'rxjs/operators';
import { Bitstream } from '../../core/shared/bitstream.model';
import { isEmpty } from '../empty.util';
import { paginatedListToArray } from '../../core/shared/operators';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { CdkDragDrop, CdkDragStart } from '@angular/cdk/drag-drop';

export abstract class AbstractPaginatedDragAndDropListComponent<T extends DSpaceObject> {
  /**
   * The URL to use for accessing the object updates from this list
   */
  url: string;

  /**
   * The objects to retrieve data for and transform into field updates
   */
  objectsRD$: Observable<RemoteData<PaginatedList<T>>>;

  /**
   * The updates to the current list
   */
  updates$: Observable<FieldUpdates>;

  /**
   * The amount of objects to display per page
   */
  pageSize = 2;

  /**
   * The page options to use for fetching the objects
   * Start at page 1 and always use the set page size
   */
  options = Object.assign(new PaginationComponentOptions(),{
    id: 'paginated-drag-and-drop-options',
    currentPage: 1,
    pageSize: this.pageSize
  });

  /**
   * The current page being displayed
   */
  currentPage$ = new BehaviorSubject<number>(1);

  /**
   * The last page we were on when we started dragging an item
   * This is used to keep track of the original page the drag started from
   */
  lastPage$ = new BehaviorSubject<number>(1);

  /**
   * A list of pages that have been initialized in the field-update store
   */
  initializedPages: number[] = [];

  protected constructor(protected objectUpdatesService: ObjectUpdatesService) {
  }

  ngOnInit() {
    this.initializeObjectsRD();
    this.initializeURL();
    this.initializeUpdates();
  }

  /**
   * Overwrite this method to define how the list of objects is initialized and updated
   */
  abstract initializeObjectsRD(): void;

  /**
   * Overwrite this method to define how the URL is set
   */
  abstract initializeURL(): void;

  /**
   * Initialize the field-updates in the store
   * This method ensures (new) pages displayed are automatically added to the field-update store when the objectsRD updates
   */
  initializeUpdates(): void {
    this.updates$ = this.objectsRD$.pipe(
      paginatedListToArray(),
      tap((objects: DSpaceObject[]) => {
        // Pages in the field-update store are indexed starting at 0 (because they're stored in an array of pages)
        const updatesPage = this.currentPage$.value - 1;
        if (isEmpty(this.initializedPages)) {
          // No updates have been initialized yet for this list, initialize the first page
          this.objectUpdatesService.initializeWithCustomOrder(this.url, objects, new Date(), this.pageSize, updatesPage);
          this.initializedPages.push(updatesPage);
        } else if (this.initializedPages.indexOf(updatesPage) < 0) {
          // Updates were initialized for this list, but not the page we're on. Add the current page to the field-update store for this list
          this.objectUpdatesService.addPageToCustomOrder(this.url, objects, updatesPage);
          this.initializedPages.push(updatesPage);
        }
      }),
      switchMap((bitstreams: Bitstream[]) => this.objectUpdatesService.getFieldUpdatesByCustomOrder(this.url, bitstreams, this.currentPage$.value - 1))
    );
  }

  /**
   * Update the current page
   * @param page
   */
  switchPage(page: number) {
    this.currentPage$.next(page);
  }

  /**
   * A bitstream was moved, send updates to the store
   * @param event
   */
  drop(event: CdkDragDrop<any>) {
    this.objectUpdatesService.saveMoveFieldUpdate(this.url, event.previousIndex, event.currentIndex, this.lastPage$.value - 1, this.currentPage$.value - 1);
  }

  dragStarted(event: CdkDragStart) {
    this.lastPage$.next(this.currentPage$.value);
  }
}
