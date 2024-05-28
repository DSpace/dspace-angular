import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, mergeMap, Observable, Subject, Subscription } from 'rxjs';
import { RemoteData } from '../../core/data/remote-data';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { SearchResult } from '../../shared/search/models/search-result.model';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { PaginatedSearchOptions } from '../../shared/search/models/paginated-search-options.model';
import { getFirstCompletedRemoteData, getFirstSucceededRemoteData } from '../../core/shared/operators';
import { SearchFilter } from '../../shared/search/models/search-filter.model';
import { LuckySearchService } from '../lucky-search.service';
import { Params, Router } from '@angular/router';
import { filter, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Context } from '../../core/shared/context.model';
import { SearchConfigurationService } from '../../core/shared/search/search-configuration.service';
import { Item } from '../../core/shared/item.model';
import { BitstreamDataService, MetadataFilter } from '../../core/data/bitstream-data.service';
import { Bitstream } from '../../core/shared/bitstream.model';
import { hasValue, isEmpty, isNotEmpty } from '../../shared/empty.util';
import { getItemPageRoute } from '../../item-page/item-page-routing-paths';
import { getBitstreamDownloadRoute } from '../../app-routing-paths';

@Component({
  selector: 'ds-lucky-search',
  templateUrl: './lucky-search.component.html',
  styleUrls: ['./lucky-search.component.scss']
})
export class LuckySearchComponent implements OnInit, OnDestroy {
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

  bitstreamFilters$ = new BehaviorSubject<MetadataFilter[]>(null);
  bitstreams$ = new BehaviorSubject<Bitstream[]>(null);
  item$ = new Subject<Item>();

  private readonly subscription = new Subscription();

  constructor(
    private luckySearchService: LuckySearchService,
    private router: Router,
    private bitstreamDataService: BitstreamDataService,
    public searchConfigService: SearchConfigurationService
  ) {}

  ngOnInit(): void {
    this.searchOptions$ = this.getSearchOptions();
    this.handleBitstreamResults();
    this.readResult();
    const urlTree = this.router.parseUrl(this.router.url);
    if (isNotEmpty(urlTree?.queryParams)) {
      const { queryParams } = urlTree;
      Object.keys(queryParams).forEach((key) => {
        if (key && key === 'index') {
          this.currentFilter.identifier = queryParams[key];
        }
        if (key && key === 'value') {
          this.currentFilter.value = queryParams[key];
        }
      });
      const value = this.parseBitstreamFilters(queryParams);
      this.bitstreamFilters$.next(value);
    }
    if (!(this.currentFilter.value !== '' && this.currentFilter.identifier !== '')) {
      this.showEmptySearchSection = true;
      return;
    }
    this.subscription.add(
      this.searchOptions$
          .pipe(switchMap((options: PaginatedSearchOptions) => this.getLuckySearchResults(options)))
          .subscribe((results) => this.resultsRD$.next(results as any))
    );
  }

  private handleBitstreamResults() {
    this.subscription.add(
      this.bitstreams$.pipe(
        filter(bitstreams => isNotEmpty(bitstreams) && bitstreams.length === 1),
        map(bitstreams => getBitstreamDownloadRoute(bitstreams[0]))
      ).subscribe(bitstreamRoute => this.redirect(bitstreamRoute))
    );
  }

  private getLuckySearchResults(options: PaginatedSearchOptions) {
    options.filters = [new SearchFilter('f.' + this.currentFilter.identifier, [this.currentFilter.value], 'equals')];
    return this.luckySearchService.sendRequest(options).pipe(
      tap((rd: any) => {
        if (rd.state && rd.state === 'Error') {
          this.showEmptySearchSection = true;
        }
      }),
      getFirstSucceededRemoteData());
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
    this.subscription.add(
        this.resultsRD$.pipe(
          filter(results => results?.payload?.totalElements === 0)
        ).subscribe(_ => this.showEmptySearchSection = true)
    );
    this.subscription.add(
        this.resultsRD$.pipe(
          filter(results =>
            this.hasBitstreamFilters() && results?.payload?.totalElements === 1
          ),
          map(results => results.payload.page[0].indexableObject as Item),
          tap(item => this.item$.next(item)),
          withLatestFrom(this.bitstreamFilters$),
          mergeMap(([item, bitstreamFilters]) => this.loadBitstreamsAndRedirectIfNeeded(item, bitstreamFilters)),
        ).subscribe(results => {
          this.showEmptySearchSection = isEmpty(results);
          this.bitstreams$.next(results);
        })
    );
    this.subscription.add(
        this.resultsRD$.pipe(
          filter(results =>
            !this.hasBitstreamFilters() && results?.payload?.totalElements === 1
          ),
          map(results => results.payload.page[0].indexableObject as Item),
          tap(item => this.item$.next(item)),
          map(item => getItemPageRoute(item))
        ).subscribe(results => this.redirect(results))
    );
    this.subscription.add(
        this.resultsRD$.pipe(
          filter(results => results?.payload?.totalElements > 1),
        ).subscribe(_ => this.showMultipleSearchSection = true)
    );
  }

  private hasBitstreamFilters(): boolean {
    return this.bitstreamFilters$.getValue()?.length > 0;
  }

  private getSearchOptions(): Observable<PaginatedSearchOptions> {
    return this.searchConfigService.paginatedSearchOptions;
  }

  public redirect(url): void {
    this.router.navigateByUrl(url, {replaceUrl: true});
  }

  private parseBitstreamFilters(queryParams: Params): MetadataFilter[] {
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

  private loadBitstreamsAndRedirectIfNeeded(item: Item, bitstreamFilters: MetadataFilter[]): Observable<Bitstream[]> {
    return this.bitstreamDataService.findByItem(item.uuid, 'ORIGINAL', bitstreamFilters, {})
      .pipe(
        getFirstCompletedRemoteData(),
        map(bitstreamsResult => bitstreamsResult.payload?.page),
      );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
