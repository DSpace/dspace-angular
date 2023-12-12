import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ThemedComponent } from '../theme-support/themed.component';
import { BrowseByComponent } from './browse-by.component';
import { Observable } from 'rxjs';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { ListableObject } from '../object-collection/shared/listable-object.model';
import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';
import { SortOptions, SortDirection } from '../../core/cache/models/sort-options.model';
import { StartsWithType } from '../starts-with/starts-with-decorator';

/**
 * Themed wrapper for {@link BrowseByComponent}
 */
@Component({
  selector: 'ds-themed-browse-by',
  styleUrls: [],
  templateUrl: '../theme-support/themed.component.html',
})
export class ThemedBrowseByComponent extends ThemedComponent<BrowseByComponent> {

  @Input() title: string;

  @Input() parentname: string;

  @Input() objects$: Observable<RemoteData<PaginatedList<ListableObject>>>;

  @Input() paginationConfig: PaginationComponentOptions;

  @Input() sortConfig: SortOptions;

  @Input() type: StartsWithType;

  @Input() startsWithOptions: number[];

  @Input() showPaginator: boolean;

  @Input() hideGear: boolean;

  @Output() prev: EventEmitter<boolean> = new EventEmitter();

  @Output() next: EventEmitter<boolean> = new EventEmitter();

  @Output() pageSizeChange: EventEmitter<number> = new EventEmitter();

  @Output() sortDirectionChange: EventEmitter<SortDirection> = new EventEmitter();

  protected inAndOutputNames: (keyof BrowseByComponent & keyof this)[] = [
    'title',
    'parentname',
    'objects$',
    'paginationConfig',
    'sortConfig',
    'type',
    'startsWithOptions',
    'showPaginator',
    'hideGear',
    'prev',
    'next',
    'pageSizeChange',
    'sortDirectionChange',
  ];

  protected getComponentName(): string {
    return 'BrowseByComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/shared/browse-by/browse-by.component.ts`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./browse-by.component');
  }

}
