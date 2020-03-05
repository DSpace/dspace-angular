import { FieldUpdates } from '../../core/data/object-updates/object-updates.reducer';
import { Observable } from 'rxjs/internal/Observable';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list';
import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ObjectUpdatesService } from '../../core/data/object-updates/object-updates.service';
import { switchMap, take, tap } from 'rxjs/operators';
import { hasValue, isEmpty, isNotEmpty } from '../empty.util';
import { paginatedListToArray } from '../../core/shared/operators';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ElementRef, ViewChild } from '@angular/core';
import { PaginationComponent } from '../pagination/pagination.component';

/**
 * An abstract component containing general methods and logic to be able to drag and drop objects within a paginated
 * list. This implementation supports being able to drag and drop objects between pages.
 * Dragging an object on top of a page number will automatically detect the page it's being dropped on, send an update
 * to the store and add the object on top of that page.
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
  pageSize = 10;

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
   * A list of pages that have been initialized in the field-update store
   */
  initializedPages: number[] = [];

  /**
   * An object storing information about an update that should be fired whenever fireToUpdate is called
   */
  toUpdate: {
    fromIndex: number,
    toIndex: number,
    fromPage: number,
    toPage: number,
    field?: T
  };

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
   * This method ensures (new) pages displayed are automatically added to the field-update store when the objectsRD updates
   */
  initializeUpdates(): void {
    this.updates$ = this.objectsRD$.pipe(
      paginatedListToArray(),
      tap((objects: T[]) => {
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

        // The new page is loaded into the store, check if there are any updates waiting and fire those as well
        this.fireToUpdate();
      }),
      switchMap((objects: T[]) => this.objectUpdatesService.getFieldUpdatesByCustomOrder(this.url, objects, this.currentPage$.value - 1))
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
   * An object was moved, send updates to the store.
   * When the object is dropped on a page within the pagination of this component, the object moves to the top of that
   * page and the pagination automatically loads and switches the view to that page.
   * @param event
   */
  drop(event: CdkDragDrop<any>) {
    // Check if the user is hovering over any of the pagination's pages at the time of dropping the object
    const droppedOnElement = this.elRef.nativeElement.querySelector('.page-item:hover');
    if (hasValue(droppedOnElement) && hasValue(droppedOnElement.textContent)) {
      // The user is hovering over a page, fetch the page's number from the element
      const page = Number(droppedOnElement.textContent);
      if (hasValue(page) && !Number.isNaN(page)) {
        const id = event.item.element.nativeElement.id;
        this.updates$.pipe(take(1)).subscribe((updates: FieldUpdates) => {
          const field = hasValue(updates[id]) ? updates[id].field : undefined;
          this.toUpdate = Object.assign({
            fromIndex: event.previousIndex,
            toIndex: 0,
            fromPage: this.currentPage$.value - 1,
            toPage: page - 1,
            field
          });
          // Switch to the dropped-on page and force a page update for the pagination component
          this.currentPage$.next(page);
          this.paginationComponent.doPageChange(page);
          if (this.initializedPages.indexOf(page - 1) >= 0) {
            // The page the object is being dropped to has already been loaded before, directly fire an update to the store.
            // For pages that haven't been loaded before, the updates$ observable will call fireToUpdate after the new page
            // has loaded
            this.fireToUpdate();
          }
        });
      }
    } else {
      this.objectUpdatesService.saveMoveFieldUpdate(this.url, event.previousIndex, event.currentIndex, this.currentPage$.value - 1, this.currentPage$.value - 1);
    }
  }

  /**
   * Method checking if there's an update ready to be fired. Send out a MoveFieldUpdate to the store if there's an
   * update present and clear the update afterwards.
   */
  fireToUpdate() {
    if (hasValue(this.toUpdate)) {
      this.objectUpdatesService.saveMoveFieldUpdate(this.url, this.toUpdate.fromIndex, this.toUpdate.toIndex, this.toUpdate.fromPage, this.toUpdate.toPage, this.toUpdate.field);
      this.toUpdate = undefined;
    }
  }
}
