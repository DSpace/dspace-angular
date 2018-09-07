import { Component, EventEmitter,
  Input,
  OnInit,
  Output, SimpleChanges, OnChanges, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { RemoteData } from '../../core/data/remote-data';
import { PageInfo } from '../../core/shared/page-info.model';

import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';

import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';

import { ListableObject } from './shared/listable-object.model';
import { hasValue, isNotEmpty } from '../empty.util';
import { ViewMode } from '../../core/shared/view-mode.model';

@Component({
  selector: 'ds-viewable-collection',
  styleUrls: ['./object-collection.component.scss'],
  templateUrl: './object-collection.component.html',
})
export class ObjectCollectionComponent implements OnChanges, OnInit {

  @Input() objects: RemoteData<ListableObject[]>;
  @Input() config?: PaginationComponentOptions;
  @Input() sortConfig: SortOptions;
  @Input() hideGear = false;
  pageInfo: Observable<PageInfo>;
  private sub;
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
  currentMode: ViewMode = ViewMode.List;
  viewModeEnum = ViewMode;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.objects && !changes.objects.isFirstChange()) {
      // this.pageInfo = this.objects.pageInfo;
    }
  }

  ngOnInit(): void {
    // this.pageInfo = this.objects.pageInfo;

    this.sub = this.route
      .queryParams
      .subscribe((params) => {
        if (isNotEmpty(params.view)) {
          this.currentMode = params.view;
        }
      });
  }

  /**
   * @param route
   *    Route is a singleton service provided by Angular.
   * @param router
   *    Router is a singleton service provided by Angular.
   */
  constructor(private cdRef: ChangeDetectorRef, private route: ActivatedRoute,
              private router: Router) {
  }

  getViewMode(): ViewMode {
    this.route.queryParams.map((params) => {
      if (isNotEmpty(params.view) && hasValue(params.view)) {
        this.currentMode = params.view;
      }
    });
    return this.currentMode;
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
