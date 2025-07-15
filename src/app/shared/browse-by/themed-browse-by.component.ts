import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Observable } from 'rxjs';

import {
  SortDirection,
  SortOptions,
} from '../../core/cache/models/sort-options.model';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { RemoteData } from '../../core/data/remote-data';
import { ListableObject } from '../object-collection/shared/listable-object.model';
import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';
import { StartsWithType } from '../starts-with/starts-with-type';
import { ThemedComponent } from '../theme-support/themed.component';
import { BrowseByComponent } from './browse-by.component';

/**
 * Themed wrapper for {@link BrowseByComponent}
 */
@Component({
  selector: 'ds-browse-by',
  styleUrls: [],
  templateUrl: '../theme-support/themed.component.html',
  standalone: true,
  imports: [
    BrowseByComponent,
  ],
})
export class ThemedBrowseByComponent extends ThemedComponent<BrowseByComponent> {

  @Input() title: string;

  @Input() displayTitle: boolean;

  @Input() objects$: Observable<RemoteData<PaginatedList<ListableObject>>>;

  @Input() paginationConfig: PaginationComponentOptions;

  @Input() sortConfig: SortOptions;

  @Input() type: StartsWithType;

  @Input() startsWithOptions: (string | number)[];

  @Input() showPaginator: boolean;

  @Input() hideGear: boolean;

  @Output() prev: EventEmitter<boolean> = new EventEmitter();

  @Output() next: EventEmitter<boolean> = new EventEmitter();

  @Output() pageSizeChange: EventEmitter<number> = new EventEmitter();

  @Output() sortDirectionChange: EventEmitter<SortDirection> = new EventEmitter();

  protected inAndOutputNames: (keyof BrowseByComponent & keyof this)[] = [
    'title',
    'displayTitle',
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
