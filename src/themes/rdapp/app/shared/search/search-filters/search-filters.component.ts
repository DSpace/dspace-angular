import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { map } from 'rxjs/operators';

import { SearchFiltersComponent as BaseComponent } from '../../../../../../app/shared/search/search-filters/search-filters.component';
import { SearchFilterComponent } from '../../../../../../app/shared/search/search-filters/search-filter/search-filter.component';

@Component({
  selector: 'ds-themed-search-filters',
  templateUrl: './search-filters.component.html',
  styleUrls: ['./search-filters.component.scss'],
  imports: [
    AsyncPipe,
    NgxSkeletonLoaderModule,
    RouterLink,
    SearchFilterComponent,
    TranslateModule,
  ],
})
export class SearchFiltersComponent extends BaseComponent implements OnInit {
  override ngOnInit(): void {
    super.ngOnInit();
    this.clearParams = this.searchConfigService.getCurrentFrontendFilters().pipe(
      map((filters) => {
        Object.keys(filters).forEach((f) => (filters[f] = null));
        return { ...filters, query: '', 'spc.page': null };
      }),
    );
  }
}
