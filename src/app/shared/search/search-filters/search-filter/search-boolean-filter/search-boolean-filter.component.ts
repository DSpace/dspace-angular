import { Component, OnInit } from '@angular/core';
import { FilterType } from '../../../models/filter-type.model';
import { renderFacetFor } from '../search-filter-type-decorator';
import { facetLoad, SearchFacetFilterComponent } from '../search-facet-filter/search-facet-filter.component';
import { TranslateModule } from '@ngx-translate/core';
import { SearchFacetOptionComponent } from '../search-facet-filter-options/search-facet-option/search-facet-option.component';
import { SearchFacetSelectedOptionComponent } from '../search-facet-filter-options/search-facet-selected-option/search-facet-selected-option.component';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';

@Component({
    selector: 'ds-search-boolean-filter',
    styleUrls: ['./search-boolean-filter.component.scss'],
    templateUrl: './search-boolean-filter.component.html',
    animations: [facetLoad],
    standalone: true,
    imports: [NgFor, SearchFacetSelectedOptionComponent, SearchFacetOptionComponent, NgIf, AsyncPipe, TranslateModule]
})

/**
 * Component that represents a boolean facet for a specific filter configuration
 */
@renderFacetFor(FilterType.boolean)
export class SearchBooleanFilterComponent extends SearchFacetFilterComponent implements OnInit {
}
