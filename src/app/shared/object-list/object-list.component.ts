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

  @Output() paginationChange: EventEmitter<SortDirection> = new EventEmitter<any>();

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

  // isDisabled(object: ListableObject): boolean {
  //   return hasValue(this.previousSelection.find((selected) => selected === object));
  // }

  selectCheckbox(value: boolean, object: ListableObject) {
    if (value) {
      this.selectionService.selectSingle(this.selectionConfig.listId, object);
    } else {
      this.selectionService.deselectSingle(this.selectionConfig.listId, object);
    }
  }

  selectRadio(value: boolean, object: ListableObject) {
    if (value) {
      this.selectionService.selectSingle(this.selectionConfig.listId, object, false);
    }
  }

  selectPage(page: SearchResult<DSpaceObject>[]) {
    this.selectionService.select(this.selectionConfig.listId, this.objects.payload.page);
  }

  deselectPage(page: SearchResult<DSpaceObject>[]) {
    this.selectionService.deselect(this.selectionConfig.listId, this.objects.payload.page);

  }

  deselectAll() {
    this.selectionService.deselectAll(this.selectionConfig.listId);
  }

  // isAllSelected() {
  //   return this.allSelected;
  // }
  //
  // isSomeSelected() {
  //   return isNotEmpty(this.selection);
  // }
  //
  //
  // selectAll() {
  //   this.allSelected = true;
  //   this.selectAllLoading = true;
  //   const fullPagination = Object.assign(new PaginationComponentOptions(), {
  //     query: this.searchQuery,
  //     currentPage: 1,
  //     pageSize: Number.POSITIVE_INFINITY
  //   });
  //   const fullSearchConfig = Object.assign(this.searchConfig, { pagination: fullPagination });
  //   const results = this.searchService.search(fullSearchConfig);
  //   results.pipe(
  //     getSucceededRemoteData(),
  //     map((resultsRD) => resultsRD.payload.page),
  //     tap(() => this.selectAllLoading = false)
  //   )
  //     .subscribe((results) =>
  //       this.selection = results
  //         .map((searchResult) => searchResult.indexableObject)
  //         .filter((dso) => hasNoValue(this.previousSelection.find((object) => object === dso)))
  //     );
  // }

}
