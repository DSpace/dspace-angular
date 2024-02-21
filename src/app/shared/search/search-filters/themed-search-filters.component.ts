import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ThemedComponent } from '../../theme-support/themed.component';
import { SearchFiltersComponent } from './search-filters.component';
import { Observable } from 'rxjs/internal/Observable';
import { RemoteData } from '../../../core/data/remote-data';
import { SearchFilterConfig } from '../models/search-filter-config.model';
import { AppliedFilter } from '../models/applied-filter.model';

/**
 * Themed wrapper for SearchFiltersComponent
 */
@Component({
  selector: 'ds-themed-search-filters',
  templateUrl: '../../theme-support/themed.component.html',
})
export class ThemedSearchFiltersComponent extends ThemedComponent<SearchFiltersComponent> {

  @Input() currentConfiguration: string;
  @Input() currentScope: string;
  @Input() inPlaceSearch: boolean;
  @Input() refreshFilters: Observable<any>;
  @Input() filters: Observable<RemoteData<SearchFilterConfig[]>>;
  @Output() changeAppliedFilters: EventEmitter<Map<string, AppliedFilter[]>> = new EventEmitter();

  protected inAndOutputNames: (keyof SearchFiltersComponent & keyof this)[] = [
    'filters', 'currentConfiguration', 'currentScope', 'inPlaceSearch', 'refreshFilters',
    'changeAppliedFilters',
  ];

  protected getComponentName(): string {
    return 'SearchFiltersComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../../themes/${themeName}/app/shared/search/search-filters/search-filters.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import('./search-filters.component');
  }
}
