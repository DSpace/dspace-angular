import { Component, OnInit } from '@angular/core';
import { facetLoad, SearchFacetFilterComponent } from '../search-facet-filter/search-facet-filter.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import {
  FilterInputSuggestionsComponent
} from '../../../../input-suggestions/filter-suggestions/filter-input-suggestions.component';
import {
  SearchFacetOptionComponent
} from '../search-facet-filter-options/search-facet-option/search-facet-option.component';
import {
  SearchFacetSelectedOptionComponent
} from '../search-facet-filter-options/search-facet-selected-option/search-facet-selected-option.component';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';

@Component({
    selector: 'ds-search-authority-filter',
    styleUrls: ['./search-authority-filter.component.scss'],
    templateUrl: './search-authority-filter.component.html',
    animations: [facetLoad],
    standalone: true,
    imports: [NgFor, SearchFacetSelectedOptionComponent, SearchFacetOptionComponent, NgIf, FilterInputSuggestionsComponent, FormsModule, AsyncPipe, TranslateModule]
})

/**
 * Component that represents an authority facet for a specific filter configuration
 */
export class SearchAuthorityFilterComponent extends SearchFacetFilterComponent implements OnInit {
}
