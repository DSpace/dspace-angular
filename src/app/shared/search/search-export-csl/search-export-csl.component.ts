import { Component, Input, OnInit } from '@angular/core';
import { combineLatest as observableCombineLatest, Observable } from 'rxjs';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { map } from 'rxjs/operators';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { AuthorizationDataService }
    from '../../../core/data/feature-authorization/authorization-data.service';
import { hasValue } from '../../empty.util';
import { PaginatedSearchOptions } from '../models/paginated-search-options.model';

@Component ({
    selector: 'ds-search-export-csl',
    styleUrls: ['./search-export-csl.component.scss'],
    templateUrl: './search-export-csl.component.html'
})
/**
 * Display a button to export the current search results as csv
 */
export class SearchExportCslComponent implements OnInit {
  /**
   * Results of the recent search.
   */
  @Input() searchConfig: PaginatedSearchOptions;

  /**
   * Observable used to determine whether the button should be shown
   */
  shouldShowButton$: Observable<boolean>;

  /**
   * The message key used for the tooltip of the button
   */
  tooltipMsg = 'metadata-export-search-csl.tooltip';

  constructor(private authorizationDataService: AuthorizationDataService
              ) {
  }

  ngOnInit(): void {
    const isAuthorized$ = this.authorizationDataService
        .isAuthorized(FeatureID.AdministratorOf);

    this.shouldShowButton$ = observableCombineLatest([isAuthorized$]) // XXX de-complicate
        .pipe(map(([isAuthorized]: [boolean]) => isAuthorized)
    );
  }

  export() {
      // build a URL from endpoint and fetch it.
      const url = this.searchConfig.toRestUrl('/path/to/csl/search/endpoint', ['csl']);
  }
}
