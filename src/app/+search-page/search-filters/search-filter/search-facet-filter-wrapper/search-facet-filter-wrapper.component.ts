import { Component, Injector, Input, OnInit } from '@angular/core';
import { renderFilterType } from '../search-filter-type-decorator';
import { FilterType } from '../../../search-service/filter-type.model';
import { SearchFilterConfig } from '../../../search-service/search-filter-config.model';

@Component({
  selector: 'ds-search-facet-filter-wrapper',
  templateUrl: './search-facet-filter-wrapper.component.html'
})
export class SearchFacetFilterWrapperComponent implements OnInit {
  @Input() filterConfig: SearchFilterConfig;
  @Input() selectedValues: string[];
  objectInjector: Injector;

  constructor(private injector: Injector) {
  }

  ngOnInit(): void {
    this.objectInjector = Injector.create({
      providers: [
        { provide: 'filterConfig', useFactory: () => (this.filterConfig), deps: [] },
        { provide: 'selectedValues', useFactory: () => (this.selectedValues), deps: [] }],

      parent: this.injector
    });

  }

  getSearchFilter(): string {
    const type: FilterType = this.filterConfig.type;
    return renderFilterType(type);
  }
}
