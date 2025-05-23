import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import {
  facetLoad,
  SearchFacetFilterComponent,
} from '../search-facet-filter/search-facet-filter.component';
import { SearchFacetOptionComponent } from '../search-facet-filter-options/search-facet-option/search-facet-option.component';
import { SearchFacetSelectedOptionComponent } from '../search-facet-filter-options/search-facet-selected-option/search-facet-selected-option.component';

@Component({
  selector: 'ds-search-boolean-filter',
  styleUrls: ['./search-boolean-filter.component.scss'],
  templateUrl: './search-boolean-filter.component.html',
  animations: [facetLoad],
  standalone: true,
  imports: [
    AsyncPipe,
    SearchFacetOptionComponent,
    SearchFacetSelectedOptionComponent,
    TranslateModule,
  ],
})

/**
 * Component that represents a boolean facet for a specific filter configuration
 */
export class SearchBooleanFilterComponent extends SearchFacetFilterComponent implements OnInit {
}
