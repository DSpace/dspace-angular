import { FieldUpdates } from '../../core/data/object-updates/object-updates.reducer';
import { Observable } from 'rxjs/internal/Observable';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list';
import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ObjectUpdatesService } from '../../core/data/object-updates/object-updates.service';
import { switchMap, take } from 'rxjs/operators';
import { hasValue } from '../empty.util';
import { paginatedListToArray } from '../../core/shared/operators';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { PaginationComponent } from '../pagination/pagination.component';

/**
 * An abstract component containing general methods and logic to be able to drag and drop objects within a paginated
 * list. This implementation supports being able to drag and drop objects between pages.
 * Dragging an object on top of a page number will automatically detect the page it's being dropped on and send a
 * dropObject event to the parent component containing detailed information about the indexes the object was dropped from
 * and to.
 *
 * To extend this component, it is important to make sure to:
 * - Initialize objectsRD$ within the initializeObjectsRD() method
 * - Initialize a unique URL for this component/page within the initializeURL() method
 * - Add (cdkDropListDropped)="drop($event)" to the cdkDropList element in your template
 * - Add (pageChange)="switchPage($event)" to the ds-pagination element in your template
 * - Use the updates$ observable for building your list of cdkDrag elements in your template
 *
 * An example component extending from this abstract component: PaginatedDragAndDropBitstreamListComponent
 */
export abstract class AbstractPaginatedDragAndDropListComponent<T extends DSpaceObject> {
  /**
   * A view on the child pagination component
   */
  @ViewChild(PaginationComponent, {static: false}) paginationComponent: PaginationComponent;

  /**
   * Send an event when the user drops an object on the pagination
   * The event contains details about the index the object came from and is dropped to (across the entirety of the list,
   * not just within a single page)
   */
  @Output() dropObject: EventEmitter<any> = new EventEmitter<any>();

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

  protected constructor(protected objectUpdatesService: ObjectUpdatesService,
                        protected elRef: ElementRef) {
  }

  /**
   * Initialize the observables
   */
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
   */
  initializeUpdates(): void {
    this.objectsRD$.pipe(
      paginatedListToArray(),
      take(1)
    ).subscribe((objects: T[]) => {
      this.objectUpdatesService.initialize(this.url, objects, new Date());
    });
    this.updates$ = this.objectsRD$.pipe(
      paginatedListToArray(),
      switchMap((objects: T[]) => this.objectUpdatesService.getFieldUpdatesExclusive(this.url, objects))
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
   * An object was moved, send updates to the dropObject EventEmitter
   * When the object is dropped on a page within the pagination of this component, the object moves to the top of that
   * page and the pagination automatically loads and switches the view to that page (this is done by calling the event's
   * finish() method after sending patch requests to the REST API)
   * @param event
   */
  drop(event: CdkDragDrop<any>) {
    const dragIndex = event.previousIndex;
    let dropIndex = event.currentIndex;
    const dragPage = this.currentPage$.value - 1;
    let dropPage = this.currentPage$.value - 1;

    // Check if the user is hovering over any of the pagination's pages at the time of dropping the object
    const droppedOnElement = this.elRef.nativeElement.querySelector('.page-item:hover');
    if (hasValue(droppedOnElement) && hasValue(droppedOnElement.textContent)) {
      // The user is hovering over a page, fetch the page's number from the element
      const droppedPage = Number(droppedOnElement.textContent);
      if (hasValue(droppedPage) && !Number.isNaN(droppedPage)) {
        dropPage = droppedPage - 1;
        dropIndex = 0;
      }
    }

    const redirectPage = dropPage + 1;
    const fromIndex = (dragPage * this.pageSize) + dragIndex;
    const toIndex = (dropPage * this.pageSize) + dropIndex;
    // Send out a drop event when the field exists and the "from" and "to" indexes are different from each other
    if (fromIndex !== toIndex) {
      this.dropObject.emit(Object.assign({
        fromIndex,
        toIndex,
        finish: () => {
          this.currentPage$.next(redirectPage);
          this.paginationComponent.doPageChange(redirectPage);
        }
      }));
    }
  }
}
