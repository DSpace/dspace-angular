import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, mergeMap, Observable, of } from 'rxjs';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { SearchResult } from '../../shared/search/models/search-result.model';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { PaginatedSearchOptions } from '../../shared/search/models/paginated-search-options.model';
import { getFirstSucceededRemoteData } from '../../core/shared/operators';
import { SearchFilter } from '../../shared/search/models/search-filter.model';
import { LuckySearchService } from '../lucky-search.service';
import { Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs/operators';
import { Context } from '../../core/shared/context.model';
import { SearchConfigurationService } from '../../core/shared/search/search-configuration.service';
import { Item } from '../../core/shared/item.model';
import { BitstreamDataService, MetadataFilter } from '../../core/data/bitstream-data.service';
import { getBitstreamDownloadRoute } from '../../app-routing-paths';
import { Bitstream } from '../../core/shared/bitstream.model';
import { hasValue } from '../../shared/empty.util';
import { getItemPageRoute } from '../../item-page/item-page-routing-paths';

@Component({
  selector: 'ds-lucky-search',
  templateUrl: './lucky-search.component.html',
  styleUrls: ['./lucky-search.component.scss']
})
export class LuckySearchComponent implements OnInit {
  /**
   * The current search results
   */
  resultsRD$: BehaviorSubject<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>> = new BehaviorSubject(null);
  /**
   * boolean to show the result in case of no results from search
   */
  showEmptySearchSection = false;
  /**
   * boolean to show the result in case of no results from multiple search
   */
  showMultipleSearchSection = false;
  /**
   * Search options to use for options of the search
   */
  searchOptions$: Observable<PaginatedSearchOptions>;
  /**
   * Current filter taken from url
   */
  currentFilter = {
    identifier: '',
    value: ''
  };
  context: Context = Context.ItemPage;

  private TITLE_METADATA = 'dc.title';
  private SOURCE_METADATA = 'dc.source';
  private DESCRIPTION_METADATA = 'dc.description';

  bitstreamFilters: MetadataFilter[];
  bitstreams$ = new BehaviorSubject([]);
  item$ = new BehaviorSubject(null);

  constructor(private luckySearchService: LuckySearchService,
              private router: Router,
              private bitstreamDataService: BitstreamDataService,
              public searchConfigService: SearchConfigurationService) {
  }

  ngOnInit(): void {
    this.searchOptions$ = this.getSearchOptions();
    this.readResult();
    const urlTree = this.router.parseUrl(this.router.url);
    if (urlTree?.queryParams) {
      Object.keys(urlTree.queryParams).forEach((key) => {
        if (key && key === 'index') {
          this.currentFilter.identifier = urlTree.queryParams[key];
        }
        if (key && key === 'value') {
          this.currentFilter.value = urlTree.queryParams[key];
        }
      });
      this.bitstreamFilters = this.parseBitstreamFilters(urlTree.queryParams);
    }
    if (!(this.currentFilter.value !== '' && this.currentFilter.identifier !== '')) {
      this.showEmptySearchSection = true;
      return;
    }
    this.searchOptions$.pipe(
      switchMap((options: PaginatedSearchOptions) => {
        options.filters = [new SearchFilter('f.' + this.currentFilter.identifier, [this.currentFilter.value], 'equals')];
        return this.luckySearchService.sendRequest(options).pipe(
          tap((rd: any) => {
            if (rd.state && rd.state === 'Error') {
              this.showEmptySearchSection = true;
            }
          }),
          getFirstSucceededRemoteData());
      }))
      .subscribe((results) => {
        return this.resultsRD$.next(results as any);
      });


  }

  getDescription(bitstream: Bitstream): string {
    return bitstream.firstMetadataValue(this.DESCRIPTION_METADATA);
  }

  fileName(bitstream: Bitstream): string {
    const title = bitstream.firstMetadataValue(this.TITLE_METADATA);
    return hasValue(title) ? title : bitstream.firstMetadataValue(this.SOURCE_METADATA);
  }

  getSize(bitstream: Bitstream): number {
    return bitstream.sizeBytes;
  }

  private readResult() {
    this.resultsRD$
      .pipe(
        filter(res => !!res),
        mergeMap(res => this.handleResultAndRedirectIfNeeded(res))
      ).subscribe();
  }

  private handleResultAndRedirectIfNeeded(res: RemoteData<PaginatedList<SearchResult<DSpaceObject>>>) {
    const total = res.payload.totalElements;
    if (total === 0) {
      this.showEmptySearchSection = true;
    } else if (total === 1) {
      return this.handleSingleItemResult(res);
    } else {
      this.showMultipleSearchSection = true;
    }
    return of(null);
  }

  private handleSingleItemResult(res: RemoteData<PaginatedList<SearchResult<DSpaceObject>>>) {
    const item = res.payload.page[0].indexableObject as Item;
    if (this.isBitstreamSearch()) {
      return this.loadBitstreamsAndRedirectIfNeeded(item);
    } else {
      this.redirect(getItemPageRoute(item));
    }
    return of(null);
  }

  private isBitstreamSearch() {
    return this.bitstreamFilters?.length;
  }

  private getSearchOptions(): Observable<PaginatedSearchOptions> {
    return this.searchConfigService.paginatedSearchOptions;
  }

  public redirect(url): void {
    this.router.navigateByUrl(url, {replaceUrl: true});
  }

  private parseBitstreamFilters(queryParams): MetadataFilter[] {
    const metadataName = queryParams?.bitstreamMetadata;
    const metadataValue = queryParams?.bitstreamValue;
    if (!!metadataName && !!metadataValue) {

      const metadataNames = Array.isArray(metadataName) ? metadataName : [metadataName];
      const metadataValues = Array.isArray(metadataValue) ? metadataValue : [metadataValue];

      return metadataNames.map((name, index) => ({
        metadataName: name,
        metadataValue: metadataValues[index]
      } as MetadataFilter));
    }
    return [];
  }

  private loadBitstreamsAndRedirectIfNeeded(item: Item): Observable<RemoteData<PaginatedList<Bitstream>>> {
    return this.bitstreamDataService.findByItem(item.uuid, 'ORIGINAL', this.bitstreamFilters, {})
      .pipe(
        getFirstSucceededRemoteData(),
        tap(bitstreamsResult => {
          const bitstreams = bitstreamsResult.payload?.page;
          this.bitstreams$.next(bitstreams);
          this.item$.next(item);

          if (!bitstreams?.length) {
            this.showEmptySearchSection = true;
          } else if (bitstreams.length === 1) {
            this.redirect(getBitstreamDownloadRoute(bitstreams[0]));
          }
        })
      );
  }
}
