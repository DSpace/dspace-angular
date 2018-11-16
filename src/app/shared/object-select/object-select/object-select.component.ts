import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list';
import { PaginationComponentOptions } from '../../pagination/pagination-component-options.model';
import { ObjectSelectService } from '../object-select.service';

/**
 * An abstract component used to select DSpaceObjects from a specific list and returning the UUIDs of the selected DSpaceObjects
 */
export abstract class ObjectSelectComponent<TDomain> implements OnInit, OnDestroy {

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
   * The message key used for the confirm button
   * @type {string}
   */
  @Input()
  confirmButton: string;

  @Input()
  hideCollection = false;

  /**
   * EventEmitter to return the selected UUIDs when the confirm button is pressed
   * @type {EventEmitter<string[]>}
   */
  @Output()
  confirm: EventEmitter<string[]> = new EventEmitter<string[]>();

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

}
