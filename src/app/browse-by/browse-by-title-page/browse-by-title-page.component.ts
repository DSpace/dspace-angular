import { combineLatest as observableCombineLatest } from 'rxjs';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  BrowseByMetadataPageComponent,
  browseParamsToOptions, getBrowseSearchOptions
} from '../browse-by-metadata-page/browse-by-metadata-page.component';
import { DSpaceObjectDataService } from '../../core/data/dspace-object-data.service';
import { BrowseService } from '../../core/browse/browse.service';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { PaginationService } from '../../core/pagination/pagination.service';
import { map } from 'rxjs/operators';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { AppConfig, APP_CONFIG } from '../../../config/app-config.interface';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
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

  public constructor(protected route: ActivatedRoute,
                     protected browseService: BrowseService,
                     protected dsoService: DSpaceObjectDataService,
                     protected paginationService: PaginationService,
                     protected router: Router,
                     @Inject(APP_CONFIG) public appConfig: AppConfig,
                     public dsoNameService: DSONameService,
  ) {
    super(route, browseService, dsoService, paginationService, router, appConfig, dsoNameService);
  }

  ngOnInit(): void {
    const sortConfig = new SortOptions('dc.title', SortDirection.ASC);
    // include the thumbnail configuration in browse search options
    this.updatePage(getBrowseSearchOptions(this.defaultBrowseId, this.paginationConfig, sortConfig, this.fetchThumbnails));
    this.currentPagination$ = this.paginationService.getCurrentPagination(this.paginationConfig.id, this.paginationConfig);
    this.currentSort$ = this.paginationService.getCurrentSort(this.paginationConfig.id, sortConfig);
    this.subs.push(
      observableCombineLatest([this.route.params, this.route.queryParams, this.currentPagination$, this.currentSort$]).pipe(
        map(([routeParams, queryParams, currentPage, currentSort]) => {
          return [Object.assign({}, routeParams, queryParams),currentPage,currentSort];
        })
      ).subscribe(([params, currentPage, currentSort]: [Params, PaginationComponentOptions, SortOptions]) => {
        this.startsWith = +params.startsWith || params.startsWith;
        this.browseId = params.id || this.defaultBrowseId;
        this.updatePageWithItems(browseParamsToOptions(params, currentPage, currentSort, this.browseId, this.fetchThumbnails), undefined, undefined);
        this.updateParent(params.scope);
        this.updateLogo();
      }));
    this.updateStartsWithTextOptions();
  }

}
