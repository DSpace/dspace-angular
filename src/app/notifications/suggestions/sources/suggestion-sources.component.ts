import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import {
  BehaviorSubject,
  Observable,
} from 'rxjs';
import {
  distinctUntilChanged,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';

import { PaginatedList } from '../../../core/data/paginated-list.model';
import { RemoteData } from '../../../core/data/remote-data';
import { SuggestionSource } from '../../../core/notifications/suggestions/models/suggestion-source.model';
import { SuggestionSourceDataService } from '../../../core/notifications/suggestions/source/suggestion-source-data.service';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { AlertComponent } from '../../../shared/alert/alert.component';
import { PaginationComponentOptions } from '../../../shared/pagination/pagination-component-options.model';
import {
  SourceListComponent,
  SourceObject,
} from '../../shared/source-list.component';

@Component({
  selector: 'ds-suggestion-sources',
  standalone: true,
  imports: [
    AlertComponent,
    AsyncPipe,
    SourceListComponent,
    TranslatePipe,
  ],
  templateUrl: './suggestion-sources.component.html',
  styleUrl: './suggestion-sources.component.scss',
})
export class SuggestionSourcesComponent {

  /**
   * The pagination system configuration for HTML listing.
   * @type {PaginationComponentOptions}
   */
  public paginationConfig: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'sl',
    pageSize: 10,
    pageSizeOptions: [5, 10, 20, 40, 60],
  });

  /**
   * Returns the information about the loading status of the suggestion sources.
   */
  public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  /**
   * The suggestion source list.
   */
  public sources$: BehaviorSubject<SourceObject[]> = new BehaviorSubject<SourceObject[]>([]);

  /**
   * The total number of Quality Assurance sources.
   */
  public totalElements$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(
    protected paginationService: PaginationService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected suggestionSourceDataService: SuggestionSourceDataService) {
    this.paginationService.getCurrentPagination(this.paginationConfig.id, this.paginationConfig).pipe(
      distinctUntilChanged(),
      switchMap((options: PaginationComponentOptions) => {
        return this.retrieveSuggestionsSources(options.currentPage, options.pageSize);
      }),
      takeUntilDestroyed(),
    ).subscribe((results: Partial<PaginatedList<SuggestionSource>>) =>  {
      console.log(results);
      this.sources$.next(results.page);
      this.totalElements$.next(results.pageInfo?.totalElements ?? 0);
      this.loading$.next(false);
    });
  }

  /**
   * Navigate to the specified source
   * @param sourceId
   */
  onSelect(sourceId: string) {
    this.router.navigate([sourceId], { relativeTo: this.route });
  }

  private retrieveSuggestionsSources(page: number, pageSize: number): Observable<Partial<PaginatedList<SuggestionSource>>> {
    this.loading$.next(true);
    const options = {
      elementsPerPage: pageSize,
      currentPage: page,
    };

    return this.suggestionSourceDataService.getSources(options).pipe(
      getFirstCompletedRemoteData(),
      tap(console.log),
      map((result: RemoteData<PaginatedList<SuggestionSource>>) => {
        return result.hasSucceeded ? result.payload : { page: [], pageInfo: null };
      }),
    );
  }
}
