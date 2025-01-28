import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Params,
  Router,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  combineLatest as observableCombineLatest,
  Observable,
} from 'rxjs';
import {
  filter,
  map, switchMap,
  take,
} from 'rxjs/operators';
import { ThemedBrowseByComponent } from 'src/app/shared/browse-by/themed-browse-by.component';

import {
  APP_CONFIG,
  AppConfig,
} from '../../../config/app-config.interface';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { BrowseService } from '../../core/browse/browse.service';
import {
  SortDirection,
  SortOptions,
} from '../../core/cache/models/sort-options.model';
import { DSpaceObjectDataService } from '../../core/data/dspace-object-data.service';
import { RemoteData } from '../../core/data/remote-data';
import { PaginationService } from '../../core/pagination/pagination.service';
import { Item } from '../../core/shared/item.model';
import { ThemedComcolPageBrowseByComponent } from '../../shared/comcol/comcol-page-browse-by/themed-comcol-page-browse-by.component';
import { ThemedComcolPageContentComponent } from '../../shared/comcol/comcol-page-content/themed-comcol-page-content.component';
import { ThemedComcolPageHandleComponent } from '../../shared/comcol/comcol-page-handle/themed-comcol-page-handle.component';
import { ComcolPageHeaderComponent } from '../../shared/comcol/comcol-page-header/comcol-page-header.component';
import { ComcolPageLogoComponent } from '../../shared/comcol/comcol-page-logo/comcol-page-logo.component';
import { isValidDate } from '../../shared/date.util';
import { DsoEditMenuComponent } from '../../shared/dso-page/dso-edit-menu/dso-edit-menu.component';
import {
  getFirstSucceededRemoteDataPayload,
  getAllSucceededRemoteDataPayload
} from '../../core/shared/operators';
import {
  hasNoValue,
  hasValue,
  isNotEmpty,
} from '../../shared/empty.util';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { StartsWithType } from '../../shared/starts-with/starts-with-type';
import { VarDirective } from '../../shared/utils/var.directive';
import {
  BrowseByMetadataComponent,
  browseParamsToOptions,
} from '../browse-by-metadata/browse-by-metadata.component';
import { SearchOptions } from '../../shared/search/models/search-options.model';
import { SearchConfigurationService } from '../../core/shared/search/search-configuration.service';
import { SearchService } from "../../core/shared/search/search.service";
import { FacetValues } from '../../shared/search/models/facet-values.model';


@Component({
  selector: 'ds-browse-by-date',
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
 * Component for browsing items by metadata definition of type 'date'
 * A metadata definition (a.k.a. browse id) is a short term used to describe one or multiple metadata fields.
 * An example would be 'dateissued' for 'dc.date.issued'
 */
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
    public searchConfigService: SearchConfigurationService,
    public searchService: SearchService
  ) {
    super(route, browseService, dsoService, paginationService, router, appConfig, dsoNameService);
  }

  ngOnInit(): void {
    const sortConfig = new SortOptions('default', SortDirection.ASC);
    this.startsWithType = StartsWithType.date;
    this.currentPagination$ = this.paginationService.getCurrentPagination(this.paginationConfig.id, this.paginationConfig);
    this.currentSort$ = this.paginationService.getCurrentSort(this.paginationConfig.id, sortConfig);
    this.subs.push(
      observableCombineLatest(
        [ this.route.params.pipe(take(1)),
          this.route.queryParams,
          this.scope$,
          this.currentPagination$,
          this.currentSort$,
        ]).pipe(
        map(([routeParams, queryParams, scope, currentPage, currentSort]) => {
          return [Object.assign({}, routeParams, queryParams), scope, currentPage, currentSort];
        }),
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
    this.searchConfigService.getConfig(null,definition).pipe(
      getFirstSucceededRemoteDataPayload(),
      map( configs => configs.filter( filter => filter.name.toUpperCase() === definition.toUpperCase()  ) ),
      filter( configs => configs.length > 0 ),
      map( findConfig =>  findConfig[0]),
      switchMap( config => {
        return this.searchService.getFacetValuesFor(config, 10).pipe(
          getAllSucceededRemoteDataPayload()
        );
      }),
      map( facetValue =>  facetValue.page ),
    ).subscribe(
      values => {
        const options = this.generateYearFromFacetValue(values);
        if (isNotEmpty(options)) {
          this.startsWithOptions = options;
          this.cdRef.detectChanges();
        }
      }
    );
  }

  /**
   * Prepare  options
   * @param data   The facets values
   */
  generateYearFromFacetValue = (data: any[]) => {
    const years: number[] = [];

    data.forEach(item => {
      const [start, end] = item.value.split(" - ").map(Number);
      for (let year = start; year <= end; year++) {
        years.push(year);
      }
    });

    return years;
  };

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
