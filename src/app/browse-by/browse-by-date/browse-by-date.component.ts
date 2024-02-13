import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { BrowseByMetadataComponent, browseParamsToOptions, getBrowseSearchOptions } from '../browse-by-metadata/browse-by-metadata.component';
import { combineLatest as observableCombineLatest, Observable } from 'rxjs';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BrowseService } from '../../core/browse/browse.service';
import { DSpaceObjectDataService } from '../../core/data/dspace-object-data.service';
import { StartsWithType } from '../../shared/starts-with/starts-with-decorator';
import { PaginationService } from '../../core/pagination/pagination.service';
import { map } from 'rxjs/operators';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import { isValidDate } from '../../shared/date.util';
import { APP_CONFIG, AppConfig } from '../../../config/app-config.interface';
import { RemoteData } from '../../core/data/remote-data';
import { Item } from '../../core/shared/item.model';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { rendersBrowseBy } from '../browse-by-switcher/browse-by-decorator';
import { BrowseByDataType } from '../browse-by-switcher/browse-by-data-type';

@Component({
  selector: 'ds-browse-by-date',
  styleUrls: ['../browse-by-metadata/browse-by-metadata.component.scss'],
  templateUrl: '../browse-by-metadata/browse-by-metadata.component.html',
})
/**
 * Component for browsing items by metadata definition of type 'date'
 * A metadata definition (a.k.a. browse id) is a short term used to describe one or multiple metadata fields.
 * An example would be 'dateissued' for 'dc.date.issued'
 */
@rendersBrowseBy(BrowseByDataType.Date)
export class BrowseByDateComponent extends BrowseByMetadataComponent implements OnInit {

  /**
   * The default metadata keys to use for determining the lower limit of the StartsWith dropdown options
   */
  defaultMetadataKeys = ['dc.date.issued'];

  public constructor(
    protected route: ActivatedRoute,
    protected browseService: BrowseService,
    protected dsoService: DSpaceObjectDataService,
    protected paginationService: PaginationService,
    protected router: Router,
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    public dsoNameService: DSONameService,
    protected cdRef: ChangeDetectorRef,
  ) {
    super(route, browseService, dsoService, paginationService, router, appConfig, dsoNameService);
  }

  ngOnInit(): void {
    const sortConfig = new SortOptions('default', SortDirection.ASC);
    this.startsWithType = StartsWithType.date;
    // include the thumbnail configuration in browse search options
    this.updatePage(getBrowseSearchOptions(this.defaultBrowseId, this.paginationConfig, sortConfig, this.fetchThumbnails));
    this.currentPagination$ = this.paginationService.getCurrentPagination(this.paginationConfig.id, this.paginationConfig);
    this.currentSort$ = this.paginationService.getCurrentSort(this.paginationConfig.id, sortConfig);
    this.subs.push(
      observableCombineLatest([this.route.params, this.route.queryParams, this.scope$, this.route.data,
        this.currentPagination$, this.currentSort$]).pipe(
        map(([routeParams, queryParams, scope, data, currentPage, currentSort]) => {
          return [Object.assign({}, routeParams, queryParams, data), scope, currentPage, currentSort];
        })
      ).subscribe(([params, scope, currentPage, currentSort]: [Params, string, PaginationComponentOptions, SortOptions]) => {
        const metadataKeys = params.browseDefinition ? params.browseDefinition.metadataKeys : this.defaultMetadataKeys;
        this.browseId = params.id || this.defaultBrowseId;
        this.startsWith = +params.startsWith || params.startsWith;
        const searchOptions = browseParamsToOptions(params, scope, currentPage, currentSort, this.browseId, this.fetchThumbnails);
        this.updatePageWithItems(searchOptions, this.value, undefined);
        this.updateStartsWithOptions(this.browseId, metadataKeys, params.scope);
      }));
  }

  /**
   * Update the StartsWith options
   * In this implementation, it creates a list of years starting from the most recent item or the current year, going
   * all the way back to the earliest date found on an item within this scope. The further back in time, the bigger
   * the change in years become to avoid extremely long lists with a one-year difference.
   * To determine the change in years, the config found under GlobalConfig.BrowseBy is used for this.
   * @param definition      The metadata definition to fetch the first item for
   * @param metadataKeys    The metadata fields to fetch the earliest date from (expects a date field)
   * @param scope           The scope under which to fetch the earliest item for
   */
  updateStartsWithOptions(definition: string, metadataKeys: string[], scope?: string) {
    const firstItemRD$: Observable<RemoteData<Item>> = this.browseService.getFirstItemFor(definition, scope, SortDirection.ASC);
    const lastItemRD$: Observable<RemoteData<Item>> = this.browseService.getFirstItemFor(definition, scope, SortDirection.DESC);
    this.loading$ = observableCombineLatest([
      firstItemRD$,
      lastItemRD$,
    ]).pipe(
      map(([firstItemRD, lastItemRD]: [RemoteData<Item>, RemoteData<Item>]) => firstItemRD.isLoading || lastItemRD.isLoading)
    );
    this.subs.push(
      observableCombineLatest([
        firstItemRD$,
        lastItemRD$,
      ]).subscribe(([firstItemRD, lastItemRD]: [RemoteData<Item>, RemoteData<Item>]) => {
        let lowerLimit: number = this.getLimit(firstItemRD, metadataKeys, this.appConfig.browseBy.defaultLowerLimit);
        let upperLimit: number = this.getLimit(lastItemRD, metadataKeys, new Date().getUTCFullYear());
        const options: number[] = [];
        const oneYearBreak: number = Math.floor((upperLimit - this.appConfig.browseBy.oneYearLimit) / 5) * 5;
        const fiveYearBreak: number = Math.floor((upperLimit - this.appConfig.browseBy.fiveYearLimit) / 10) * 10;
        if (lowerLimit <= fiveYearBreak) {
          lowerLimit -= 10;
        } else if (lowerLimit <= oneYearBreak) {
          lowerLimit -= 5;
        } else {
          lowerLimit -= 1;
        }
        let i: number = upperLimit;
        while (i > lowerLimit) {
          options.push(i);
          if (i <= fiveYearBreak) {
            i -= 10;
          } else if (i <= oneYearBreak) {
            i -= 5;
          } else {
            i--;
          }
        }
        if (isNotEmpty(options)) {
          this.startsWithOptions = options;
          this.cdRef.detectChanges();
        }
      })
    );
  }

  /**
   * Returns the year from the item metadata field or the limit.
   * @param itemRD the item remote data
   * @param metadataKeys The metadata fields to fetch the earliest date from (expects a date field)
   * @param limit the limit to use if the year can't be found in metadata
   * @private
   */
  private getLimit(itemRD: RemoteData<Item>, metadataKeys: string[], limit: number): number {
    if (hasValue(itemRD.payload)) {
      const date = itemRD.payload.firstMetadataValue(metadataKeys);
      if (isNotEmpty(date) && isValidDate(date)) {
        const dateObj = new Date(date);
        // TODO: it appears that getFullYear (based on local time) is sometimes unreliable. Switching to UTC.
        return isNaN(dateObj.getUTCFullYear()) ? limit : dateObj.getUTCFullYear();
      } else {
        return new Date().getUTCFullYear();
      }
    }
  }
}
