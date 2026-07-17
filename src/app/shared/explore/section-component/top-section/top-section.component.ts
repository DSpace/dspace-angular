
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  SortDirection,
  SortOptions,
} from '@dspace/core/cache/models/sort-options.model';
import { TopSection } from '@dspace/core/layout/models/section.model';
import { PaginationComponentOptions } from '@dspace/core/pagination/pagination-component-options.model';
import { Context } from '@dspace/core/shared/context.model';
import { PaginatedSearchOptions } from '@dspace/core/shared/search/models/paginated-search-options.model';
import { TranslateModule } from '@ngx-translate/core';

import { ThemedBrowseMostElementsComponent } from '../../../browse-most-elements/themed-browse-most-elements.component';


/**
 * Component representing the Top component section.
 */
@Component({
  selector: 'ds-base-top-section',
  templateUrl: './top-section.component.html',
  imports: [
    ThemedBrowseMostElementsComponent,
    TranslateModule,
  ],
})
export class TopSectionComponent implements OnInit {

  @Input()
  sectionId: string;

  @Input()
  topSection: TopSection;

  @Input()
  context: Context = Context.BrowseMostElements;

  paginatedSearchOptions: PaginatedSearchOptions;

  ngOnInit() {
    const order = this.topSection.order;
    const numberOfItems = this.topSection.numberOfItems;
    const sortDirection = order && order.toUpperCase() === 'ASC' ? SortDirection.ASC : SortDirection.DESC;
    const pagination: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
      id: 'search-object-pagination',
      pageSize: numberOfItems,
      currentPage: 1,
    });

    this.paginatedSearchOptions = new PaginatedSearchOptions({
      configuration: this.topSection.discoveryConfigurationName,
      pagination: pagination,
      sort: new SortOptions(this.topSection.sortField, sortDirection),
    });
  }

}
