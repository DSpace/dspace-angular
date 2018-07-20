import { Component, Injector, Input, OnInit } from '@angular/core';
import { renderFilterType } from '../search-filter-type-decorator';
import { FilterType } from '../../../search-service/filter-type.model';
import { SearchFilterConfig } from '../../../search-service/search-filter-config.model';
import { FILTER_CONFIG } from '../search-filter.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'ds-search-facet-filter-wrapper',
  templateUrl: './search-facet-filter-wrapper.component.html'
})
export class SearchFacetFilterWrapperComponent implements OnInit {
  @Input() filterConfig: SearchFilterConfig;
  @Input() selectedValues: Observable<string[]>;
  objectInjector: Injector;

  constructor(private injector: Injector) {
  }

  ngOnInit(): void {
    this.objectInjector = Injector.create({
      providers: [
        { provide: FILTER_CONFIG, useFactory: () => (this.filterConfig), deps: [] }
      ],
      parent: this.injector
    });
  }

  getSearchFilter(): string {
    const type: FilterType = this.filterConfig.type;
    return renderFilterType(type);
  }
}
