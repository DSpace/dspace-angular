import { combineLatest as observableCombineLatest } from 'rxjs';
import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { hasValue } from '../../shared/empty.util';
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
import { VarDirective } from '../../shared/utils/var.directive';
import { AsyncPipe, NgIf } from '@angular/common';
import { ComcolPageHeaderComponent } from '../../shared/comcol/comcol-page-header/comcol-page-header.component';
import { ComcolPageLogoComponent } from '../../shared/comcol/comcol-page-logo/comcol-page-logo.component';
import {
  ThemedComcolPageHandleComponent
} from '../../shared/comcol/comcol-page-handle/themed-comcol-page-handle.component';
import { ComcolPageContentComponent } from '../../shared/comcol/comcol-page-content/comcol-page-content.component';
import { DsoEditMenuComponent } from '../../shared/dso-page/dso-edit-menu/dso-edit-menu.component';
import {
  ThemedComcolPageBrowseByComponent
} from '../../shared/comcol/comcol-page-browse-by/themed-comcol-page-browse-by.component';
import { BrowseByComponent } from '../../shared/browse-by/browse-by.component';
import { TranslateModule } from '@ngx-translate/core';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { ThemedBrowseByComponent } from 'src/app/shared/browse-by/themed-browse-by.component';

@Component({
    selector: 'ds-browse-by-title-page',
    styleUrls: ['../browse-by-metadata-page/browse-by-metadata-page.component.scss'],
    templateUrl: '../browse-by-metadata-page/browse-by-metadata-page.component.html',
    standalone: true,
  imports: [
    VarDirective,
    AsyncPipe,
    ComcolPageHeaderComponent,
    ComcolPageLogoComponent,
    NgIf,
    ThemedComcolPageHandleComponent,
    ComcolPageContentComponent,
    DsoEditMenuComponent,
    ThemedComcolPageBrowseByComponent,
    BrowseByComponent,
    TranslateModule,
    ThemedLoadingComponent,
    ThemedBrowseByComponent
  ],
})
/**
 * Component for browsing items by title (dc.title)
 */
export class BrowseByTitlePageComponent extends BrowseByMetadataPageComponent {

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

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }

}
