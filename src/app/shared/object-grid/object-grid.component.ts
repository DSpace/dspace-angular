import { combineLatest as observableCombineLatest, BehaviorSubject, Observable } from 'rxjs';

import { startWith, distinctUntilChanged, map } from 'rxjs/operators';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input, OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';

import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { PaginatedList } from '../../core/data/paginated-list';

import { RemoteData } from '../../core/data/remote-data';
import { fadeIn } from '../animations/fade';
import { hasNoValue, hasValue } from '../empty.util';
import { HostWindowService, WidthCategory } from '../host-window.service';
import { ListableObject } from '../object-collection/shared/listable-object.model';

import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'ds-object-grid',
  styleUrls: ['./object-grid.component.scss'],
  templateUrl: './object-grid.component.html',
  animations: [fadeIn]
})

export class ObjectGridComponent implements OnInit {

  @Input() config: PaginationComponentOptions;
  @Input() sortConfig: SortOptions;
  @Input() hideGear = false;
  @Input() hidePagerWhenSinglePage = true;
  private _objects$: BehaviorSubject<RemoteData<PaginatedList<ListableObject>>>;

  @Input() set objects(objects: RemoteData<PaginatedList<ListableObject>>) {
    this._objects$.next(objects);
  }

  get objects() {
    return this._objects$.getValue();
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
  columns$: Observable<ListableObject[]>

  constructor(private hostWindow: HostWindowService) {
    this._objects$ = new BehaviorSubject(undefined);
  }

  ngOnInit(): void {
    const nbColumns$ = this.hostWindow.widthCategory.pipe(
      map((widthCat: WidthCategory) => {
        switch (widthCat) {
          case WidthCategory.XL:
          case WidthCategory.LG: {
            return 3;
          }
          case WidthCategory.MD:
          case WidthCategory.SM: {
            return 2;
          }
          default: {
            return 1;
          }
        }
      }),
      distinctUntilChanged()
    ).pipe(startWith(3));

    this.columns$ = observableCombineLatest(
      nbColumns$,
      this._objects$).pipe(map(([nbColumns, objects]) => {
      if (hasValue(objects) && hasValue(objects.payload) && hasValue(objects.payload.page)) {
        const page = objects.payload.page;

        const result = [];

        page.forEach((obj: ListableObject, i: number) => {
          const colNb = i % nbColumns;
          let col = result[colNb];
          if (hasNoValue(col)) {
            col = [];
          }
          result[colNb] = [...col, obj];
        });
        return result;
      } else {
        return [];
      }
    }));
  }

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

}
