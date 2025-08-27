import {
  AsyncPipe,
  isPlatformServer,
} from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { Params } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  combineLatest as observableCombineLatest,
  Observable,
  of,
} from 'rxjs';
import {
  distinctUntilChanged,
  map,
} from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import {
  SortDirection,
  SortOptions,
} from '../../core/cache/models/sort-options.model';
import { ThemedBrowseByComponent } from '../../shared/browse-by/themed-browse-by.component';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import {
  BrowseByMetadataComponent,
  browseParamsToOptions,
} from '../browse-by-metadata/browse-by-metadata.component';

@Component({
  selector: 'ds-browse-by-title',
  styleUrls: ['../browse-by-metadata/browse-by-metadata.component.scss'],
  templateUrl: '../browse-by-metadata/browse-by-metadata.component.html',
  standalone: true,
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
        this.scope$,
        this.currentPagination$,
        this.currentSort$,
      ]).subscribe(([params, scope, currentPage, currentSort]: [Params, string, PaginationComponentOptions, SortOptions]) => {
        this.startsWith = +params.startsWith || params.startsWith;
        this.browseId = params.id || this.defaultBrowseId;
        this.updatePageWithItems(browseParamsToOptions(params, scope, currentPage, currentSort, this.browseId, this.fetchThumbnails), undefined, undefined);
      }));
    this.updateStartsWithTextOptions();
  }

}
