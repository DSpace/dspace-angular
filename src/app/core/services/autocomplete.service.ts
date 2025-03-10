import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import {
  map,
  Observable,
} from 'rxjs';
import {
  APP_CONFIG,
  AppConfig,
} from 'src/config/app-config.interface';

import { AutocompleteOption } from '../../../config/autocomplete.option.interface';
import { SearchAutocompleteFilterConfig } from '../../../config/search-filter-config.interface';
import { SearchFilterConfig } from '../../shared/search/models/search-filter-config.model';
import { getAllSucceededRemoteDataPayload } from '../shared/operators';
import { SearchConfigurationService } from '../shared/search/search-configuration.service';


@Injectable({ providedIn: 'root' })
export class AutocompleteService {
  private defaultSearch: AutocompleteOption = {
    id: 'all',
    label: `autocomplete.all-dspace`,
    query: (termValue) => ({ query: termValue }),
  };

  public showItems = false;
  public termsToShow = [];

  constructor(private httpClient: HttpClient, @Inject(APP_CONFIG) protected appConfig: AppConfig, protected searchConfigService: SearchConfigurationService) {}
  /*
  * Get all facets options to search
  * */
  chargeOptions(): Observable<AutocompleteOption[]> {
    return this.searchConfigService.getConfig().pipe(
      getAllSucceededRemoteDataPayload(),
      map((config) => {
        return this.resolveOptions(config);
      }),
    );
  }

  /*
  * Filter
  * */
  resolveOptions(filters: SearchFilterConfig[]) {
    // Filter the current search filters according to configuration
    const listToShow = new Set(this.appConfig.searchFilter.map(filter => filter.faceName));

    const handleFilters = filters.filter(filter => listToShow.has(filter.name));
    const filers = this.appConfig.searchFilter.filter(searchFilterConfig => handleFilters.some(handleFilter => handleFilter.name === searchFilterConfig.faceName));
    return this.transformOptions(filers);
  }

  transformOptions(filters: SearchAutocompleteFilterConfig[]) {
    const optionsList: AutocompleteOption [] = [];
    //Se default option to search in all repository
    optionsList.push(this.defaultSearch);

    filters.forEach((filter) => {
      optionsList.push({
        id: filter.faceName,
        label: `autocomplete.filter.label.${filter.faceName}`,
        query: (value) => {
          const operator  = this.resolveOperators(filter.queryPredicate,value);
          return { [`f.${filter.faceName}`]: operator };
        },
        browse: `${filter.origin}`,
        queryParams: (value) => {
          if (filter.type === 'browser' || filter.type === 'facets') {
            filter.queryParams.prefix = value;
          }
          return filter.queryParams;
        },
      });
    });

    return optionsList;
  }

  /**
   * Process filters values to search
   * */
  resolveOperators(operator: string, value: string) {
    switch (operator) {
      case 'equals':
        return `${value},equals`;
      case 'contains':
        return `${value},contains`;
    }
  }

  /*
  * Get al coincidences and create a template listo to show
  * */
  autocomplete(searchText: string,results: string []) {
    const termsToShow = [];
    for (const termString of results) {
      const indexStartOfTheCoindicende = this.indexOfCoincidence(termString, searchText);
      let textToShow = termString.substr(0, indexStartOfTheCoindicende);
      textToShow += '<strong>' + termString.substr(indexStartOfTheCoindicende, searchText.length) + '</strong>';
      textToShow += termString.substr(indexStartOfTheCoindicende + searchText.length);
      const recordToShow = {
        text: textToShow,
        value: termString,
      };
      termsToShow.push(recordToShow);
    }
    this.termsToShow = termsToShow;
    this.showItems = this.termsToShow.length !== 0;
  }

  /*
  * Get the index from coincidence to add strong tag in results view
  * */
  indexOfCoincidence(completeTerm: string, subTerm: string) {
    completeTerm = completeTerm.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    subTerm = subTerm.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    return completeTerm.indexOf(subTerm);
  }


  /*
  * Build the query params to search in facet filters
  * */
  buildQueryParams(url: string,params: any): string {
    const validEntries = Object.entries(params).filter(
      ([_, value]) => value !== null && value !== undefined,
    );
    if (validEntries.length === 0) {
      return '';
    }
    const queryString = validEntries
      .map(([key, value]) => {
        const encodedKey = encodeURIComponent(key);
        const encodedValue = encodeURIComponent((value as string).toString());
        return `${encodedKey}=${encodedValue}`;
      })
      .join('&');
    return `${url}?${queryString}`;
  }

  /*
  * Resolver all types of results in the search (facets, browser)
  * */
  getResults(browser: string, params: any): Observable<any> {
    const url = `${this.appConfig.rest.baseUrl}/${browser}`;
    const href$ =  this.buildQueryParams(url,params);

    return this.httpClient.get<any>(href$).pipe(
      map((data: any) => {
        if (data._embedded.values) {
          return data._embedded.values.map(({ label }) => label);
        }
        if (data._embedded.items) {
          return data._embedded.items.map(({ name }) => name);
        }
        return data._embedded.entries.map(({ value }) => value);
      }),
    );
  }
}
