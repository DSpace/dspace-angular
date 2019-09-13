import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';

import { RemoteData } from '../../core/data/remote-data';
import { PageInfo } from '../../core/shared/page-info.model';
import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { ListableObject } from './shared/listable-object.model';
import { SetViewMode } from '../view-mode';
import { hasValue, isEmpty, isNotEmpty } from '../empty.util';

@Component({
  selector: 'ds-viewable-collection',
  styleUrls: ['./object-collection.component.scss'],
  templateUrl: './object-collection.component.html',
})
export class ObjectCollectionComponent implements OnInit {

  @Input() objects: RemoteData<ListableObject[]>;
  @Input() config?: PaginationComponentOptions;
  @Input() sortConfig: SortOptions;
  @Input() hasBorder = false;
  @Input() hideGear = false;
  pageInfo: Observable<PageInfo>;
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
  currentMode$: Observable<SetViewMode>;
  viewModeEnum = SetViewMode;

  ngOnInit(): void {
    this.currentMode$ = this.route
      .queryParams
      .pipe(
        filter((params) => isNotEmpty(params.view)),
        map((params) => params.view),
        startWith(SetViewMode.List)
      );
  }

  /**
   * @param cdRef
   *    ChangeDetectorRef service provided by Angular.
   * @param route
   *    Route is a singleton service provided by Angular.
   * @param router
   *    Router is a singleton service provided by Angular.
   */
  constructor(
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router) {
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
