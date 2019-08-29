import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { PaginatedList } from '../../core/data/paginated-list';
import { RemoteData } from '../../core/data/remote-data';
import { fadeIn } from '../animations/fade';
import { ListableObject } from '../object-collection/shared/listable-object.model';
import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { SearchResult } from '../search/search-result.model';
import { SelectableListService } from './selectable-list/selectable-list.service';
import { map, take, tap } from 'rxjs/operators';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'ds-object-list',
  styleUrls: ['./object-list.component.scss'],
  templateUrl: './object-list.component.html',
  animations: [fadeIn]
})
export class ObjectListComponent {
  @Input() config: PaginationComponentOptions;
  @Input() sortConfig: SortOptions;
  @Input() hasBorder = false;
  @Input() hideGear = false;
  @Input() hidePagerWhenSinglePage = true;
  @Input() selectable = false;
  @Input() selectionConfig: { repeatable: boolean, listId: string };
  // @Input() previousSelection: ListableObject[] = [];
  // allSelected = false;
  // selectAllLoading = false;

  private _objects: RemoteData<PaginatedList<ListableObject>>;

  constructor(protected selectionService: SelectableListService) {
  }

  @Input() set objects(objects: RemoteData<PaginatedList<ListableObject>>) {
    this._objects = objects;
  }

  get objects() {
    return this._objects;
  }

  /**
   * An event fired when the page is changed.
   * Event's payload equals to the newly selected page.
   */
  @Output() change: EventEmitter<{
    pagination: PaginationComponentOptions,
    sort: SortOptions
  }> = new EventEmitter<{
    pagination: PaginationComponentOptions,
    sort: SortOptions
  }>();

  /**
   * An event fired when the page is changed.
   * Event's payload equals to the newly selected page.
   */
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  /**
   * An event fired when the page wsize is changed.
   * Event's payload equals to the newly selected page size.
   */
  @Output() pageSizeChange: EventEmitter<number> = new EventEmitter<number>();

  /**
   * An event fired when the sort direction is changed.
   * Event's payload equals to the newly selected sort direction.
   */
  @Output() sortDirectionChange: EventEmitter<SortDirection> = new EventEmitter<SortDirection>();

  @Output() paginationChange: EventEmitter<any> = new EventEmitter<any>();

  @Output() deselectObject: EventEmitter<ListableObject> = new EventEmitter<ListableObject>();

  @Output() selectObject: EventEmitter<ListableObject> = new EventEmitter<ListableObject>();
  /**
   * An event fired when the sort field is changed.
   * Event's payload equals to the newly selected sort field.
   */
  @Output() sortFieldChange: EventEmitter<string> = new EventEmitter<string>();
  data: any = {};

  onPageChange(event) {
    this.pageChange.emit(event);
  }

  onPageSizeChange(event) {
    this.pageSizeChange.emit(event);
  }

  onSortDirectionChange(event) {
    this.sortDirectionChange.emit(event);
  }

  onSortFieldChange(event) {
    this.sortFieldChange.emit(event);
  }

  onPaginationChange(event) {
    this.paginationChange.emit(event);
  }

  selectCheckbox(value: boolean, object: ListableObject) {
    if (value) {
      this.selectionService.selectSingle(this.selectionConfig.listId, object);
      this.selectObject.emit(object);

    } else {
      this.selectionService.deselectSingle(this.selectionConfig.listId, object);
      this.deselectObject.emit(object);
    }
  }

  selectRadio(value: boolean, object: ListableObject) {
    const selected$ = this.selectionService.getSelectableList(this.selectionConfig.listId);
    selected$.pipe(
      take(1),
      map((selected) => selected ? selected.selection : [])
    ).subscribe((selection) => {
      // First deselect any existing selections, this is a radio button
      selection.forEach((selectedObject) => {
        this.selectionService.deselectSingle(this.selectionConfig.listId, selectedObject);
        this.deselectObject.emit(selectedObject);
      });
      if (value) {
        this.selectionService.selectSingle(this.selectionConfig.listId, object);
        this.selectObject.emit(object);
      }
    });


  }
}
