import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthorizationDataService }
    from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
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
    search_path = '/api/discover/search';

    /**
     * Results of the recent search.
     */
    @Input() searchConfig: PaginatedSearchOptions;

    /**
     * Available bibliographic formats.
     */
    bibStyles: string[];

    /**
     * Selected format.
     */
    @Input() bibStyle: string;

    /**
     * Observable used to determine whether the button should be shown
     */
    shouldShowButton$: Observable<boolean>;

    /**
     * The message key used for the tooltip of the button
     */
    tooltipMsg = 'metadata-export-search-csl.tooltip';

    constructor(private authorizationDataService: AuthorizationDataService,
        private http: HttpClient
        ) {
    }

  ngOnInit(): void {
      this.shouldShowButton$ = this.authorizationDataService
        .isAuthorized(FeatureID.AdministratorOf)
        .pipe(map((isAuthorized: boolean) => isAuthorized));

      const getter = this.http.get(this.search_path + '/csl/styles', { responseType: 'json' })
        .subscribe((body: string) => this.bibStyles = JSON.parse(body));
      getter.unsubscribe();
  }

  export() {
      // build a URL from endpoint and fetch it.
      const moreParams : string = new HttpParams()
        .set('cslType', this.bibStyle)
        .toString();
      const url = this.searchConfig.toRestUrl(this.search_path + '/csl',
        [moreParams]);
      console.log(url); // XXX DEBUG
      // Request search returning bib-styled report as "attachment"
      window.location.href = url;
  }
}
