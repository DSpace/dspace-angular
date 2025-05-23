import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import {
  SortDirection,
  SortOptions,
} from '../../core/cache/models/sort-options.model';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { RemoteData } from '../../core/data/remote-data';
import { Context } from '../../core/shared/context.model';
import { CollectionElementLinkType } from '../object-collection/collection-element-link.type';
import { ListableObject } from '../object-collection/shared/listable-object.model';
import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';
import { ThemedComponent } from '../theme-support/themed.component';
import { ObjectListComponent } from './object-list.component';

/**
 * Themed wrapper for ObjectListComponent
 */
@Component({
  selector: 'ds-object-list',
  styleUrls: [],
  templateUrl: '../theme-support/themed.component.html',
  standalone: true,
  imports: [
    ObjectListComponent,
  ],
})
export class ThemedObjectListComponent extends ThemedComponent<ObjectListComponent> {

  /**
   * The current pagination configuration
   */
  @Input() config: PaginationComponentOptions;

  /**
   * The current sort configuration
   */
  @Input() sortConfig: SortOptions;

  /**
   * Whether or not the list elements have a border
   */
  @Input() hasBorder: boolean;

  /**
   * The whether or not the gear is hidden
   */
  @Input() hideGear: boolean;

  /**
   * Whether or not the pager is visible when there is only a single page of results
   */
  @Input() hidePagerWhenSinglePage: boolean;

  @Input() selectable: boolean;

  @Input() selectionConfig: { repeatable: boolean, listId: string };

  @Input() showRSS: SortOptions | boolean;

  /**
   * The link type of the listable elements
   */
  @Input() linkType: CollectionElementLinkType;

  /**
   * The context of the listable elements
   */
  @Input() context: Context;

  /**
   * Option for hiding the pagination detail
   */
  @Input() hidePaginationDetail: boolean;

  /**
   * Whether or not to add an import button to the object
   */
  @Input() importable: boolean;

  /**
   * Config used for the import button
   */
  @Input() importConfig: { importLabel: string };

  /**
   * Whether or not the pagination should be rendered as simple previous and next buttons instead of the normal pagination
   */
  @Input() showPaginator: boolean;

  /**
   * Whether to show the thumbnail preview
   */
  @Input() showThumbnails;

  /**
   * Emit when one of the listed object has changed.
   */
  @Output() contentChange: EventEmitter<any> = new EventEmitter();

  /**
   * If showPaginator is set to true, emit when the previous button is clicked
   */
  @Output() prev: EventEmitter<boolean> = new EventEmitter();

  /**
   * If showPaginator is set to true, emit when the next button is clicked
   */
  @Output() next: EventEmitter<boolean> = new EventEmitter();

  @Input() objects: RemoteData<PaginatedList<ListableObject>>;

  /**
   * An event fired when the page is changed.
   * Event's payload equals to the newly selected page.
   */
  @Output() change: EventEmitter<{
    pagination: PaginationComponentOptions,
    sort: SortOptions
  }> = new EventEmitter();

  /**
   * An event fired when the page is changed.
   * Event's payload equals to the newly selected page.
   */
  @Output() pageChange: EventEmitter<number> = new EventEmitter();

  /**
   * An event fired when the page wsize is changed.
   * Event's payload equals to the newly selected page size.
   */
  @Output() pageSizeChange: EventEmitter<number> = new EventEmitter();

  /**
   * An event fired when the sort direction is changed.
   * Event's payload equals to the newly selected sort direction.
   */
  @Output() sortDirectionChange: EventEmitter<SortDirection> = new EventEmitter();

  /**
   * An event fired when on of the pagination parameters changes
   */
  @Output() paginationChange: EventEmitter<any> = new EventEmitter();

  @Output() deselectObject: EventEmitter<ListableObject> = new EventEmitter();

  @Output() selectObject: EventEmitter<ListableObject> = new EventEmitter();

  /**
   * Send an import event to the parent component
   */
  @Output() importObject: EventEmitter<ListableObject> = new EventEmitter();

  /**
   * An event fired when the sort field is changed.
   * Event's payload equals to the newly selected sort field.
   */
  @Output() sortFieldChange: EventEmitter<string> = new EventEmitter();

  inAndOutputNames: (keyof ObjectListComponent & keyof this)[] = [
    'config',
    'sortConfig',
    'hasBorder',
    'hideGear',
    'showRSS',
    'hidePagerWhenSinglePage',
    'selectable',
    'selectionConfig',
    'linkType',
    'context',
    'hidePaginationDetail',
    'importable',
    'importConfig',
    'showPaginator',
    'showThumbnails',
    'contentChange',
    'prev',
    'next',
    'objects',
    'change',
    'pageChange',
    'pageSizeChange',
    'sortDirectionChange',
    'paginationChange',
    'deselectObject',
    'selectObject',
    'importObject',
    'sortFieldChange',
  ];

  protected getComponentName(): string {
    return 'ObjectListComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/shared/object-list/object-list.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./object-list.component');
  }
}
