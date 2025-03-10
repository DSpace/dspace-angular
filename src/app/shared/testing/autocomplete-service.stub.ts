
import {
  Observable,
  of,
} from 'rxjs';

import { AutocompleteOption } from '../../../config/autocomplete.option.interface';
import { SearchAutocompleteFilterConfig } from '../../../config/search-filter-config.interface';
import { SearchFilterConfig } from '../search/models/search-filter-config.model';


/**
 * Stub class for {@link AutocompleteService}
 */
export class AutocompleteServiceStub {
  private defaultSearch: AutocompleteOption = {
    id: 'all',
    label: `autocomplete.all-dspace`,
    query: (termValue) => ({ query: termValue }),
  };

  public showItems = false;
  public termsToShow = [];



  chargeOptions(): Observable<AutocompleteOption[]> {
    return of([]);
  }

  resolveOptions(filters: SearchFilterConfig[]) {
    return [];
  }

  transformOptions(filters: SearchAutocompleteFilterConfig[]) {
    return [];
  }

  resolveOperators(operator: string, value: string): string {
    return '';
  }



  autocomplete(searchText: string,results: string []) {
  }

  indexOfCoincidence(completeTerm: string, subTerm: string) {
    return -1;
  }


  buildQueryParams(url: string,params: any): string {
    return '';
  }

  getResults(browser: string, params: any): Observable<any> {
    return of({});
  }
}
