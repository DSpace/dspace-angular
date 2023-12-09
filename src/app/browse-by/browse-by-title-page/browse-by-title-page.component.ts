import { combineLatest as observableCombineLatest } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Params } from '@angular/router';
import {
  BrowseByMetadataPageComponent,
  browseParamsToOptions, getBrowseSearchOptions
} from '../browse-by-metadata-page/browse-by-metadata-page.component';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { map } from 'rxjs/operators';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { rendersBrowseBy } from '../browse-by-switcher/browse-by-decorator';
import { BrowseByDataType } from '../browse-by-switcher/browse-by-data-type';

@Component({
  selector: 'ds-browse-by-title-page',
  styleUrls: ['../browse-by-metadata-page/browse-by-metadata-page.component.scss'],
  templateUrl: '../browse-by-metadata-page/browse-by-metadata-page.component.html'
})
/**
 * Component for browsing items by title (dc.title)
 */
@rendersBrowseBy(BrowseByDataType.Title)
export class BrowseByTitlePageComponent extends BrowseByMetadataPageComponent implements OnInit {

  ngOnInit(): void {
    const sortConfig = new SortOptions('dc.title', SortDirection.ASC);
    // include the thumbnail configuration in browse search options
    this.updatePage(getBrowseSearchOptions(this.defaultBrowseId, this.paginationConfig, sortConfig, this.fetchThumbnails));
    this.currentPagination$ = this.paginationService.getCurrentPagination(this.paginationConfig.id, this.paginationConfig);
    this.currentSort$ = this.paginationService.getCurrentSort(this.paginationConfig.id, sortConfig);
    this.subs.push(
      observableCombineLatest([this.route.params, this.route.queryParams, this.currentPagination$, this.currentSort$]).pipe(
        map(([routeParams, queryParams, currentPage, currentSort]) => {
          return [Object.assign({}, routeParams, queryParams), currentPage, currentSort];
        })
      ).subscribe(([params, currentPage, currentSort]: [Params, PaginationComponentOptions, SortOptions]) => {
        this.startsWith = +params.startsWith || params.startsWith;
        this.browseId = params.id || this.defaultBrowseId;
        this.updatePageWithItems(browseParamsToOptions(params, currentPage, currentSort, this.browseId, this.fetchThumbnails), undefined, undefined);
      }));
    this.updateStartsWithTextOptions();
  }

}
