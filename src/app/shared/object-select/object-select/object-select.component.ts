import { EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list';
import { PaginationComponentOptions } from '../../pagination/pagination-component-options.model';
import { ObjectSelectService } from '../object-select.service';
import { SortOptions } from '../../../core/cache/models/sort-options.model';

/**
 * An abstract component used to select DSpaceObjects from a specific list and returning the UUIDs of the selected DSpaceObjects
 */
export abstract class ObjectSelectComponent<TDomain> implements OnInit, OnDestroy {

  /**
   * A unique key used for the object select service
   */
  @Input()
  key: string;

  /**
   * The list of DSpaceObjects to display
   */
  @Input()
  dsoRD$: Observable<RemoteData<PaginatedList<TDomain>>>;

  /**
   * The pagination options used to display the DSpaceObjects
   */
  @Input()
  paginationOptions: PaginationComponentOptions;

  /**
   * The sorting options used to display the DSpaceObjects
   */
  @Input()
  sortOptions: SortOptions;

  /**
   * The message key used for the confirm button
   * @type {string}
   */
  @Input()
  confirmButton: string;

  /**
   * The message key used for the cancel button
   * @type {string}
   */
  @Input()
  cancelButton: string;

  /**
   * An event fired when the cancel button is clicked
   */
  @Output()
  cancel = new EventEmitter<any>();

  /**
   * EventEmitter to return the selected UUIDs when the confirm button is pressed
   * @type {EventEmitter<string[]>}
   */
  @Output()
  confirm: EventEmitter<string[]> = new EventEmitter<string[]>();

  /**
   * Whether or not to render the confirm button as danger (for example if confirm deletes objects)
   * Defaults to false
   */
  @Input()
  dangerConfirm = false;

  /**
   * The list of selected UUIDs
   */
  selectedIds$: Observable<string[]>;

  constructor(protected objectSelectService: ObjectSelectService) {
  }

  ngOnInit(): void {
    this.selectedIds$ = this.objectSelectService.getAllSelected(this.key);
  }

  ngOnDestroy(): void {
    this.objectSelectService.reset(this.key);
  }

  /**
   * Switch the state of a checkbox
   * @param {string} id
   */
  switch(id: string) {
    this.objectSelectService.switch(this.key, id);
  }

  /**
   * Get the current state of a checkbox
   * @param {string} id   The dso's UUID
   * @returns {Observable<boolean>}
   */
  getSelected(id: string): Observable<boolean> {
    return this.objectSelectService.getSelected(this.key, id);
  }

  /**
   * Called when the confirm button is pressed
   * Sends the selected UUIDs to the parent component
   */
  confirmSelected() {
    this.selectedIds$.pipe(
      take(1)
    ).subscribe((ids: string[]) => {
      this.confirm.emit(ids);
      this.objectSelectService.reset(this.key);
    });
  }

  /**
   * Fire a cancel event
   */
  onCancel() {
    this.cancel.emit();
  }

}
