import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { FilterInputSuggestionsComponent } from '../../../../input-suggestions/filter-suggestions/filter-input-suggestions.component';
import { addOperatorToFilterValue } from '../../../search.utils';
import {
  facetLoad,
  SearchFacetFilterComponent,
} from '../search-facet-filter/search-facet-filter.component';
import { SearchFacetOptionComponent } from '../search-facet-filter-options/search-facet-option/search-facet-option.component';
import { SearchFacetSelectedOptionComponent } from '../search-facet-filter-options/search-facet-selected-option/search-facet-selected-option.component';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */

@Component({
  selector: 'ds-search-text-filter',
  styleUrls: ['./search-text-filter.component.scss'],
  templateUrl: './search-text-filter.component.html',
  animations: [facetLoad],
  standalone: true,
  imports: [
    AsyncPipe,
    FilterInputSuggestionsComponent,
    FormsModule,
    SearchFacetOptionComponent,
    SearchFacetSelectedOptionComponent,
    TranslateModule,
  ],
})

/**
 * Component that represents a text facet for a specific filter configuration
 */
export class SearchTextFilterComponent extends SearchFacetFilterComponent implements OnInit {
  /**
   * Submits a new active custom value to the filter from the input field
   * Overwritten method from parent component, adds the "query" operator to the received data before passing it on
   * @param data The string from the input field
   */
  onSubmit(data: any) {
    super.onSubmit(addOperatorToFilterValue(data, 'query'));
  }
}
