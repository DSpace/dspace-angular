import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ItemDataService } from '../../core/data/item-data.service';
import { PaginatedList } from '../../core/data/paginated-list';
import { RemoteData } from '../../core/data/remote-data';
import { Observable } from 'rxjs/Observable';
import { Item } from '../../core/shared/item.model';
import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';
import { ItemSelectService } from './item-select.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'ds-item-select',
  styleUrls: ['./item-select.component.scss'],
  templateUrl: './item-select.component.html'
})

/**
 * A component used to select items from a specific list and returning the UUIDs of the selected items
 */
export class ItemSelectComponent implements OnInit {

  /**
   * The list of items to display
   */
  @Input()
  itemsRD$: Observable<RemoteData<PaginatedList<Item>>>;

  /**
   * The pagination options used to display the items
   */
  @Input()
  paginationOptions: PaginationComponentOptions;

  /**
   * The message key used for the confirm button
   * @type {string}
   */
  @Input()
  confirmButton = 'item.select.confirm';

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

  constructor(private itemSelectService: ItemSelectService) {
  }

  ngOnInit(): void {
    this.selectedIds$ = this.itemSelectService.getAllSelected();
  }

  /**
   * Switch the state of a checkbox
   * @param {string} id
   */
  switch(id: string) {
    this.itemSelectService.switch(id);
  }

  /**
   * Get the current state of a checkbox
   * @param {string} id   The item's UUID
   * @returns {Observable<boolean>}
   */
  getSelected(id: string): Observable<boolean> {
    return this.itemSelectService.getSelected(id);
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
      this.itemSelectService.reset();
    });
  }

}
