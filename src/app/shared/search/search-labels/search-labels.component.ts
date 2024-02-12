import { Component, Input } from '@angular/core';
import { AppliedFilter } from '../models/applied-filter.model';

@Component({
  selector: 'ds-search-labels',
  styleUrls: ['./search-labels.component.scss'],
  templateUrl: './search-labels.component.html',
})

/**
 * Component that represents the labels containing the currently active filters
 */
export class SearchLabelsComponent {

  /**
   * True when the search component should show results on the current page
   */
  @Input() inPlaceSearch: boolean;

  /**
   * The {@link AppliedFilter}s by filter name
   */
  @Input() appliedFilters: Map<string, AppliedFilter[]>;

}
