import {
  AsyncPipe,
  isPlatformServer,
} from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import {
  SortDirection,
  SortOptions,
} from '@dspace/core/cache/models/sort-options.model';
import { TranslateModule } from '@ngx-translate/core';
import {
  combineLatest as observableCombineLatest,
  of,
} from 'rxjs';
import {
  map,
  switchMap,
} from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { ThemedBrowseByComponent } from '../../shared/browse-by/themed-browse-by.component';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import {
  BrowseByMetadataComponent,
  browseParamsToOptions,
} from '../browse-by-metadata/browse-by-metadata.component';

@Component({
  selector: 'ds-browse-by-title',
  styleUrls: ['../browse-by-metadata/browse-by-metadata.component.scss'],
  templateUrl: '../browse-by-metadata/browse-by-metadata.component.html',
  imports: [
    AsyncPipe,
    ThemedBrowseByComponent,
    ThemedLoadingComponent,
    TranslateModule,
  ],
})
/**
 * Component for browsing items by title (dc.title)
 */
export class BrowseByTitleComponent extends BrowseByMetadataComponent implements OnInit {

  ngOnInit(): void {
    if (!this.renderOnServerSide && !environment.ssr.enableBrowseComponent && isPlatformServer(this.platformId)) {
      this.loading$ = of(false);
      return;
    }
    this.browseId = this.route.snapshot.params.id;
    this.subs.push(
      this.browseService.getConfiguredSortDirection(this.browseId, SortDirection.ASC).pipe(
        map((sortDir) => new SortOptions(this.browseId, sortDir)),
        switchMap((sortConfig) => {
          this.currentSort$ = this.paginationService.getCurrentSort(this.paginationConfig.id, sortConfig, false);
          this.currentPagination$ = this.paginationService.getCurrentPagination(this.paginationConfig.id, this.paginationConfig);
          return observableCombineLatest([this.route.params, this.route.queryParams, this.scope$, this.currentPagination$, this.currentSort$]).pipe(
            map(([routeParams, queryParams, scope, currentPage, currentSort]) => ({
              params: Object.assign({}, routeParams, queryParams), scope, currentPage, currentSort,
            })),
          );
        })).subscribe(({ params, scope, currentPage, currentSort }) => {
        this.startsWith = +params.startsWith || params.startsWith;
        this.updatePageWithItems(browseParamsToOptions(params, scope, currentPage, currentSort, this.browseId, this.fetchThumbnails), undefined, undefined);
        this.updateStartsWithTextOptions();
      }));
  }

}
