import { combineLatest as observableCombineLatest } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Params } from '@angular/router';
import {
  BrowseByMetadataComponent,
  browseParamsToOptions, getBrowseSearchOptions
} from '../browse-by-metadata/browse-by-metadata.component';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { map } from 'rxjs/operators';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { rendersBrowseBy } from '../browse-by-switcher/browse-by-decorator';
import { BrowseByDataType } from '../browse-by-switcher/browse-by-data-type';

@Component({
  selector: 'ds-browse-by-title',
  styleUrls: ['../browse-by-metadata/browse-by-metadata.component.scss'],
  templateUrl: '../browse-by-metadata/browse-by-metadata.component.html'
})
/**
 * Component for browsing items by title (dc.title)
 */
@rendersBrowseBy(BrowseByDataType.Title)
export class BrowseByTitleComponent extends BrowseByMetadataComponent implements OnInit {

  ngOnInit(): void {
    const sortConfig = new SortOptions('dc.title', SortDirection.ASC);
    // include the thumbnail configuration in browse search options
    this.updatePage(getBrowseSearchOptions(this.defaultBrowseId, this.paginationConfig, sortConfig, this.fetchThumbnails));
    this.currentPagination$ = this.paginationService.getCurrentPagination(this.paginationConfig.id, this.paginationConfig);
    this.currentSort$ = this.paginationService.getCurrentSort(this.paginationConfig.id, sortConfig);
    this.subs.push(
      observableCombineLatest([this.route.params, this.route.queryParams, this.scope$, this.currentPagination$, this.currentSort$]).pipe(
        map(([routeParams, queryParams, scope, currentPage, currentSort]) => {
          return [Object.assign({}, routeParams, queryParams), scope, currentPage, currentSort];
        })
      ).subscribe(([params, scope, currentPage, currentSort]: [Params, string, PaginationComponentOptions, SortOptions]) => {
        this.startsWith = +params.startsWith || params.startsWith;
        this.browseId = params.id || this.defaultBrowseId;
        this.updatePageWithItems(browseParamsToOptions(params, scope, currentPage, currentSort, this.browseId, this.fetchThumbnails), undefined, undefined);
      }));
    this.updateStartsWithTextOptions();
  }

}
