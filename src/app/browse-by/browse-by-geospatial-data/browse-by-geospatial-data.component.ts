import {
  AsyncPipe,
  isPlatformBrowser,
  NgIf,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import {
  ActivatedRoute,
  Params,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  combineLatest,
  Observable,
  of,
} from 'rxjs';
import {
  filter,
  map,
  switchMap,
  take,
} from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteDataPayload,
} from '../../core/shared/operators';
import { SearchService } from '../../core/shared/search/search.service';
import { SearchConfigurationService } from '../../core/shared/search/search-configuration.service';
import { hasValue } from '../../shared/empty.util';
import { GeospatialMapComponent } from '../../shared/geospatial-map/geospatial-map.component';
import { FacetValues } from '../../shared/search/models/facet-values.model';
import { PaginatedSearchOptions } from '../../shared/search/models/paginated-search-options.model';

@Component({
  selector: 'ds-browse-by-geospatial-data',
  templateUrl: './browse-by-geospatial-data.component.html',
  styleUrls: ['./browse-by-geospatial-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    GeospatialMapComponent,
    NgIf,
    TranslateModule,
  ],
  standalone: true,
})
/**
 * Component displaying a large 'browse map', which is really a geolocation few of the 'point' facet defined
 * in the geospatial discovery configuration.
 * The markers are clustered by location, and each individual marker will link to a search page for that point value
 * as a filter.
 *
 * @author Kim Shepherd
 */
export class BrowseByGeospatialDataComponent implements OnInit {

  protected readonly isPlatformBrowser = isPlatformBrowser;

  public facetValues$: Observable<FacetValues> = of(null);

  constructor(
    @Inject(PLATFORM_ID) public platformId: string,
    private searchConfigurationService: SearchConfigurationService,
    private searchService: SearchService,
    protected route: ActivatedRoute,
  ) {}

  public scope$: Observable<string> ;

  ngOnInit(): void {
    this.scope$ = this.route.queryParams.pipe(
      map((params: Params) => params.scope),
    );
    this.facetValues$ = this.getFacetValues();
  }

  /**
   * Get facet values for use in rendering 'browse by' geospatial map
   */
  getFacetValues(): Observable<FacetValues> {
    return combineLatest([this.scope$, this.searchConfigurationService.getConfig(
      // If the geospatial configuration is not found, default will be returned and used
      '', environment.geospatialMapViewer.spatialFacetDiscoveryConfiguration).pipe(
      getFirstCompletedRemoteData(),
      getFirstSucceededRemoteDataPayload(),
      filter((searchFilterConfigs) => hasValue(searchFilterConfigs)),
      take(1),
      map((searchFilterConfigs) => searchFilterConfigs[0]),
      filter((searchFilterConfig) => hasValue(searchFilterConfig))),
    ],
    ).pipe(
      switchMap(([scope, searchFilterConfig]) => {
        // Get all points in one page, if possible
        searchFilterConfig.pageSize = 99999;
        const searchOptions: PaginatedSearchOptions = Object.assign({
          'configuration': environment.geospatialMapViewer.spatialFacetDiscoveryConfiguration,
          'scope': scope,
          'facetLimit': 99999,
        });
        return this.searchService.getFacetValuesFor(searchFilterConfig, 1, searchOptions,
          null, true);
      }),
      getFirstCompletedRemoteData(),
      getFirstSucceededRemoteDataPayload(),
    );
  }
}
