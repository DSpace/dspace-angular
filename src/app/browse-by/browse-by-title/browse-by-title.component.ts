import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { Params } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { combineLatest as observableCombineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  SortDirection,
  SortOptions,
} from '../../core/cache/models/sort-options.model';
import { ThemedBrowseByComponent } from '../../shared/browse-by/themed-browse-by.component';
import { ThemedComcolPageBrowseByComponent } from '../../shared/comcol/comcol-page-browse-by/themed-comcol-page-browse-by.component';
import { ThemedComcolPageContentComponent } from '../../shared/comcol/comcol-page-content/themed-comcol-page-content.component';
import { ThemedComcolPageHandleComponent } from '../../shared/comcol/comcol-page-handle/themed-comcol-page-handle.component';
import { ComcolPageHeaderComponent } from '../../shared/comcol/comcol-page-header/comcol-page-header.component';
import { ComcolPageLogoComponent } from '../../shared/comcol/comcol-page-logo/comcol-page-logo.component';
import { DsoEditMenuComponent } from '../../shared/dso-page/dso-edit-menu/dso-edit-menu.component';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { VarDirective } from '../../shared/utils/var.directive';
import {
  BrowseByMetadataComponent,
  browseParamsToOptions,
  getBrowseSearchOptions,
} from '../browse-by-metadata/browse-by-metadata.component';

@Component({
  selector: 'ds-browse-by-title',
  styleUrls: ['../browse-by-metadata/browse-by-metadata.component.scss'],
  templateUrl: '../browse-by-metadata/browse-by-metadata.component.html',
  standalone: true,
  imports: [
    VarDirective,
    AsyncPipe,
    ComcolPageHeaderComponent,
    ComcolPageLogoComponent,
    NgIf,
    ThemedComcolPageHandleComponent,
    ThemedComcolPageContentComponent,
    DsoEditMenuComponent,
    ThemedComcolPageBrowseByComponent,
    TranslateModule,
    ThemedLoadingComponent,
    ThemedBrowseByComponent,
  ],
})
/**
 * Component for browsing items by title (dc.title)
 */
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
        }),
      ).subscribe(([params, scope, currentPage, currentSort]: [Params, string, PaginationComponentOptions, SortOptions]) => {
        this.startsWith = +params.startsWith || params.startsWith;
        this.browseId = params.id || this.defaultBrowseId;
        this.updatePageWithItems(browseParamsToOptions(params, scope, currentPage, currentSort, this.browseId, this.fetchThumbnails), undefined, undefined);
      }));
    this.updateStartsWithTextOptions();
  }

}
