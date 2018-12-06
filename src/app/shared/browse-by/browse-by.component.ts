import { Component, Input } from '@angular/core';

import { Observable } from 'rxjs';

import { SortOptions } from '../../core/cache/models/sort-options.model';
import { PaginatedList } from '../../core/data/paginated-list';
import { RemoteData } from '../../core/data/remote-data';
import { fadeIn, fadeInOut } from '../animations/fade';
import { ListableObject } from '../object-collection/shared/listable-object.model';
import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';

@Component({
  selector: 'ds-browse-by',
  styleUrls: ['./browse-by.component.scss'],
  templateUrl: './browse-by.component.html',
  animations: [
    fadeIn,
    fadeInOut
  ]
})
/**
 * Component to display a browse-by page for any ListableObject
 */
export class BrowseByComponent {
  @Input() title: string;
  @Input() objects$: Observable<RemoteData<PaginatedList<ListableObject>>>;
  @Input() paginationConfig: PaginationComponentOptions;
  @Input() sortConfig: SortOptions;
  @Input() currentUrl: string;
  query: string;
}
