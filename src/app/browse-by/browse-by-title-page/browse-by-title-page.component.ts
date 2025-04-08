import { combineLatest as observableCombineLatest, Observable } from 'rxjs';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { hasValue } from '../../shared/empty.util';
import {
  BrowseByMetadataPageComponent,
  browseParamsToOptions
} from '../browse-by-metadata-page/browse-by-metadata-page.component';
import { DSpaceObjectDataService } from '../../core/data/dspace-object-data.service';
import { BrowseService } from '../../core/browse/browse.service';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { PaginationService } from '../../core/pagination/pagination.service';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { of as observableOf } from 'rxjs';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { AppConfig, APP_CONFIG } from '../../../config/app-config.interface';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { isPlatformServer } from '@angular/common';
import { environment } from '../../../environments/environment';
import { SearchManager } from '../../core/browse/search-manager';

@Component({
  selector: 'ds-browse-by-title-page',
  styleUrls: ['../browse-by-metadata-page/browse-by-metadata-page.component.scss'],
  templateUrl: '../browse-by-metadata-page/browse-by-metadata-page.component.html'
})
/**
 * Component for browsing items by title (dc.title)
 */
export class BrowseByTitlePageComponent extends BrowseByMetadataPageComponent {

  public constructor(protected route: ActivatedRoute,
                     protected browseService: BrowseService,
                     protected searchManager: SearchManager,
                     protected dsoService: DSpaceObjectDataService,
                     protected paginationService: PaginationService,
                     protected router: Router,
                     @Inject(APP_CONFIG) public appConfig: AppConfig,
                     public dsoNameService: DSONameService,
                     @Inject(PLATFORM_ID) public platformId: any,
  ) {
    super(route, browseService, searchManager, dsoService, paginationService, router, appConfig, dsoNameService, platformId);
  }

  ngOnInit(): void {
    if (!this.renderOnServerSide && !environment.universal.enableBrowseComponent && isPlatformServer(this.platformId)) {
      this.loading$ = observableOf(false);
      return;
    }
    const sortConfig = new SortOptions('dc.title', SortDirection.ASC);
    this.currentPagination$ = this.paginationService.getCurrentPagination(this.paginationConfig.id, this.paginationConfig);
    this.currentSort$ = this.paginationService.getCurrentSort(this.paginationConfig.id, sortConfig);
    const routeParams$: Observable<Params> = observableCombineLatest([
      this.route.params,
      this.route.queryParams,
    ]).pipe(
      map(([params, queryParams]: [Params, Params]) => Object.assign({}, params, queryParams)),
      distinctUntilChanged((prev: Params, curr: Params) => prev.id === curr.id && prev.startsWith === curr.startsWith),
    );
    this.subs.push(
      observableCombineLatest([
        routeParams$,
        this.currentPagination$,
        this.currentSort$,
      ]).subscribe(([params, currentPage, currentSort]: [Params, PaginationComponentOptions, SortOptions]) => {
        this.startsWith = +params.startsWith || params.startsWith;
        this.browseId = params.id || this.defaultBrowseId;
        this.updatePageWithItems(browseParamsToOptions(params, currentPage, currentSort, this.browseId, this.fetchThumbnails), undefined, undefined);
        this.updateParent(params.scope);
        this.updateLogo();
      }));
    this.updateStartsWithTextOptions();
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

}
