import { Component, Input } from '@angular/core';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list';
import { PaginationComponentOptions } from '../pagination/pagination-component-options.model';
import { SortOptions } from '../../core/cache/models/sort-options.model';
import { fadeIn, fadeInOut } from '../animations/fade';
import { Observable } from 'rxjs';
import { ListableObject } from '../object-collection/shared/listable-object.model';

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
  /**
   * The i18n message to display as title
   */
  @Input() title: string;

  /**
   * The list of objects to display
   */
  @Input() objects$: Observable<RemoteData<PaginatedList<ListableObject>>>;

  /**
   * The pagination configuration used for the list
   */
  @Input() paginationConfig: PaginationComponentOptions;

  /**
   * The sorting configuration used for the list
   */
  @Input() sortConfig: SortOptions;
}
