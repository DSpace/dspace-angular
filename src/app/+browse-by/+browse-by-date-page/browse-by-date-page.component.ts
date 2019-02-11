import { Component } from '@angular/core';
import {
  BrowseByMetadataPageComponent,
  browseParamsToOptions
} from '../+browse-by-metadata-page/browse-by-metadata-page.component';
import { BrowseEntrySearchOptions } from '../../core/browse/browse-entry-search-options.model';
import { combineLatest as observableCombineLatest } from 'rxjs/internal/observable/combineLatest';
import { BrowseByStartsWithType } from '../../shared/browse-by/browse-by.component';

@Component({
  selector: 'ds-browse-by-date-page',
  styleUrls: ['../+browse-by-metadata-page/browse-by-metadata-page.component.scss'],
  templateUrl: '../+browse-by-metadata-page/browse-by-metadata-page.component.html'
})
/**
 * Component for browsing items by metadata definition of type 'date'
 * A metadata definition is a short term used to describe one or multiple metadata fields.
 * An example would be 'dateissued' for 'dc.date.issued'
 */
export class BrowseByDatePageComponent extends BrowseByMetadataPageComponent {

  oneYearLimit = 10;
  fiveYearLimit = 30;

  ngOnInit(): void {
    this.startsWithType = BrowseByStartsWithType.date;
    this.updatePage(new BrowseEntrySearchOptions(null, this.paginationConfig, this.sortConfig));
    this.subs.push(
      observableCombineLatest(
        this.route.params,
        this.route.queryParams,
        this.route.data,
        (params, queryParams, data ) => {
          return Object.assign({}, params, queryParams, data);
        })
        .subscribe((params) => {
          this.metadata = params.metadata || this.defaultMetadata;
          this.startsWith = +params.startsWith || params.startsWith;
          const searchOptions = browseParamsToOptions(params, Object.assign({}), this.sortConfig, this.metadata);
          this.updatePageWithItems(searchOptions, this.value);
          this.updateParent(params.scope);
        }));
    const options = [];
    const currentYear = new Date().getFullYear();
    const oneYearBreak = Math.floor((currentYear - this.oneYearLimit) / 5) * 5;
    const fiveYearBreak = Math.floor((currentYear - this.fiveYearLimit) / 10) * 10;
    const lowerLimit = 1900; // Hardcoded atm, this should be the lowest date issued
    let i = currentYear;
    while (i > lowerLimit) {
      options.push(i);
      if (i <= fiveYearBreak) {
        i -= 10;
      } else if (i <= oneYearBreak) {
        i -= 5;
      } else {
        i--;
      }
    }
    console.log(options);
  }

}
