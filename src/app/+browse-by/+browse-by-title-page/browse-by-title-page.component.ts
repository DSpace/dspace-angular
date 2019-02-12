import { combineLatest as observableCombineLatest } from 'rxjs';
import { Component } from '@angular/core';
import { ItemDataService } from '../../core/data/item-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { hasValue } from '../../shared/empty.util';
import {
  BrowseByMetadataPageComponent,
  browseParamsToOptions
} from '../+browse-by-metadata-page/browse-by-metadata-page.component';
import { BrowseEntrySearchOptions } from '../../core/browse/browse-entry-search-options.model';
import { DSpaceObjectDataService } from '../../core/data/dspace-object-data.service';
import { BrowseService } from '../../core/browse/browse.service';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';

@Component({
  selector: 'ds-browse-by-title-page',
  styleUrls: ['../+browse-by-metadata-page/browse-by-metadata-page.component.scss'],
  templateUrl: '../+browse-by-metadata-page/browse-by-metadata-page.component.html'
})
/**
 * Component for browsing items by title (dc.title)
 */
export class BrowseByTitlePageComponent extends BrowseByMetadataPageComponent {

  public constructor(protected route: ActivatedRoute,
                     protected browseService: BrowseService,
                     protected dsoService: DSpaceObjectDataService,
                     protected router: Router,
                     protected itemDataService: ItemDataService) {
    super(route, browseService, dsoService, router);
  }

  ngOnInit(): void {
    this.sortConfig = new SortOptions('dc.title', SortDirection.ASC);
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
          this.updatePage(browseParamsToOptions(params, this.paginationConfig, this.sortConfig));
          this.updateParent(params.scope)
        }));
    this.startsWithOptions = [];
  }

  /**
   * Updates the current page with searchOptions
   * @param searchOptions   Options to narrow down your search:
   *                        { pagination: PaginationComponentOptions,
   *                          sort: SortOptions }
   */
  updatePage(searchOptions: BrowseEntrySearchOptions) {
    this.items$ = this.itemDataService.findAll({
      currentPage: searchOptions.pagination.currentPage,
      elementsPerPage: searchOptions.pagination.pageSize,
      sort: searchOptions.sort,
      scopeID: searchOptions.scope
    });
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

}
