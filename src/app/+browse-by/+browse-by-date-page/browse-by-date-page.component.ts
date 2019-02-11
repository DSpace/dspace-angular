import { Component } from '@angular/core';
import {
  BrowseByMetadataPageComponent,
  browseParamsToOptions
} from '../+browse-by-metadata-page/browse-by-metadata-page.component';
import { BrowseEntrySearchOptions } from '../../core/browse/browse-entry-search-options.model';
import { combineLatest as observableCombineLatest } from 'rxjs/internal/observable/combineLatest';

@Component({
  selector: 'ds-browse-by-date-page',
  styleUrls: ['./browse-by-date-page.component.scss'],
  templateUrl: './browse-by-date-page.component.html'
})
/**
 * Component for browsing items by metadata definition of type 'date'
 * A metadata definition is a short term used to describe one or multiple metadata fields.
 * An example would be 'dateissued' for 'dc.date.issued'
 */
export class BrowseByDatePageComponent extends BrowseByMetadataPageComponent {

  ngOnInit(): void {
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
          const searchOptions = browseParamsToOptions(params, Object.assign({}), this.sortConfig, this.metadata);
          this.updatePageWithItems(searchOptions, this.value);
          this.updateParent(params.scope);
        }));
  }

}
