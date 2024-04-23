// eslint-disable-next-line max-classes-per-file
import { Component, OnInit } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Site } from '../core/shared/site.model';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { SearchService } from '../core/shared/search/search.service';
import { SearchFilterConfig } from '../shared/search/models/search-filter-config.model';
import { SearchOptions } from '../shared/search/models/search-options.model';
import { getFirstSucceededRemoteDataPayload } from '../core/shared/operators';
import { PaginationComponentOptions } from '../shared/pagination/pagination-component-options.model';
import { FilterType } from '../shared/search/models/filter-type.model';
import { HALEndpointService } from '../core/shared/hal-endpoint.service';
import { FacetValue } from '../shared/search/models/facet-value.model';
import { ConfigurationDataService } from '../core/data/configuration-data.service';
import { ConfigurationProperty } from '../core/shared/configuration-property.model';
import { Item } from '../core/shared/item.model';
import { SiteDataService } from '../core/data/site-data.service';
import { UsageReport } from '../core/statistics/models/usage-report.model';
import { ItemDataService } from '../core/data/item-data.service';
import { PaginatedSearchOptions } from '../shared/search/models/paginated-search-options.model';
import { DSpaceObjectType } from '../core/shared/dspace-object-type.model';
import { SortDirection, SortOptions } from '../core/cache/models/sort-options.model';
import { SearchObjects } from '../shared/search/models/search-objects.model';

/**
 * The home page component customized for the CLARIN-DSpace.
 */
import { environment } from '../../environments/environment';
import { UsageReportDataService } from '../core/statistics/usage-report-data.service';
import { isUndefined } from '../shared/empty.util';

const MAX_TRUNCATE_LENGTH = 20;

@Component({
  selector: 'ds-home-page',
  styleUrls: ['./home-page.component.scss'],
  templateUrl: './home-page.component.html',
  providers: [NgbCarouselConfig]
})
export class HomePageComponent implements OnInit {

  slides = [
    {name: 'Linguistic Data', short: 'LData'},
    {name: 'Deposit Free And Save', short: 'Free Deposit'},
    {name: 'Citation', short: 'Citation'}
  ];

  site$: Observable<Site>;
  recentSubmissionspageSize: number;

  authors$: BehaviorSubject<FastSearchLink[]> = new BehaviorSubject<FastSearchLink[]>([]);
  subjects$: BehaviorSubject<FastSearchLink[]> = new BehaviorSubject<FastSearchLink[]>([]);
  languages$: BehaviorSubject<FastSearchLink[]> = new BehaviorSubject<FastSearchLink[]>([]);

  newItems$: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);
  topItems$: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);

  siteId: string;

  baseUrl = '';

  /**
   * Link to the search page
   */
  searchLink: string;

  constructor(
    private route: ActivatedRoute, config: NgbCarouselConfig,
    protected searchService: SearchService,
    protected halService: HALEndpointService,
    protected configurationService: ConfigurationDataService,
    protected usageReportService: UsageReportDataService,
    protected siteService: SiteDataService,
    protected itemService: ItemDataService,
    protected router: Router
  ) {
    this.recentSubmissionspageSize = environment.homePage.recentSubmissions.pageSize;
    config.interval = 5000;
    config.keyboard = false;
    config.showNavigationArrows = false;
    config.showNavigationIndicators = false;
    config.pauseOnHover = false;
  }

  ngOnInit(): void {
    this.site$ = this.route.data.pipe(
      map((data) => data.site as Site),
    );
    this.assignSiteId();

    // Load the most used authors, subjects and language (ISO)
    this.loadAuthors();
    this.loadSubject();
    this.loadLanguages();

    // Load the most viewed Items and the new Items
    this.loadTopItems();
    this.loadNewItems();

    this.searchLink = this.searchService.getSearchLink();
  }

  /**
   * Get the last added Items.
   * @private
   */
  private loadNewItems() {
    const paginationOptions = Object.assign(new PaginationComponentOptions(), {
      id: 'new-items',
      currentPage: 1,
      pageSize: 3
    });

    const sortConfiguration = new SortOptions('dc.date.accessioned', SortDirection.DESC);
    this.searchService.search(
      new PaginatedSearchOptions({
        configuration: 'homepage',
        pagination: paginationOptions,
        sort: sortConfiguration,
        dsoTypes: [DSpaceObjectType.ITEM]
      }))
      .pipe(getFirstSucceededRemoteDataPayload())
      .subscribe((searchObjects: SearchObjects<Item>) => {
        const searchedItems: Item[] = [];
        searchObjects?.page?.forEach(searchObject => {
          searchedItems.push(searchObject?.indexableObject);
        });
        this.newItems$.next(searchedItems);
      });
  }

  /**
   * Get the most viewed Items from the Solr statistics.
   * @private
   */
  private async loadTopItems() {
    const top3ItemsId = [];
    const maxTopItemsCount = 3;

    await this.getItemUsageReports()
      .then((usageReports: UsageReport[]) => {
        const usageReport = usageReports?.[0];
        for (let i = 0; i < maxTopItemsCount; i++) {
          top3ItemsId.push(usageReport.points?.[i]?.id);
        }
      });

    this.topItems$ = new BehaviorSubject<Item[]>([]);
    for (let i = 0; i < maxTopItemsCount; i++) {
      if (isUndefined(top3ItemsId?.[i])) {
        return;
      }
      this.itemService.findById(top3ItemsId?.[i], false)
        .pipe(getFirstSucceededRemoteDataPayload())
        .subscribe((item: Item) => {
          this.topItems$.value.push(item);
        });
    }
  }

  /**
   * Get usage reports for the viewing The Most Viewed Items
   * @private
   */
  private getItemUsageReports(): Promise<any> {
    const uri = this.halService.getRootHref() + '/core/sites/' + this.siteId;

    return this.usageReportService.searchStatistics(uri, 0, 10)
      .pipe(take(1)).toPromise();
  }

  private assignSiteId() {
    this.site$
      .pipe(take(1))
      .subscribe((site: Site) => {
        this.siteId = site.uuid;
      });
  }

  /**
   * Load the most used authors.
   * @private
   */
  private loadAuthors() {
    const facetName = 'author';
    this.getFastSearchLinks(facetName, this.authors$);
  }

  /**
   * Load the most used subjects.
   * @private
   */
  private loadSubject() {
    const facetName = 'subjectFirstValue';
    this.getFastSearchLinks(facetName, this.subjects$);
  }

  /**
   * Load the most used languages.
   * @private
   */
  private loadLanguages() {
    const facetName = 'language';
    this.getFastSearchLinks(facetName, this.languages$);
  }

  /**
   * Get the `authors/subjects/languages` from the Solr statistics.
   * @param facetName
   * @param behaviorSubject
   */
  async getFastSearchLinks(facetName, behaviorSubject: BehaviorSubject<any>) {
    await this.assignBaseUrl();
    const searchFilter: SearchFilterConfig = Object.assign(new SearchFilterConfig(), {
      name: facetName,
      filterType: FilterType.text,
      hasFacets: false,
      isOpenByDefault: false,
      pageSize: 5,
      _links: {
        self: {
          href: this.halService.getRootHref() + '/discover/facets/' + facetName
        },
      },
    });
    const searchOptions: SearchOptions = new SearchOptions({configuration: 'homepage'});
    this.searchService.getFacetValuesFor(searchFilter, 1, searchOptions)
      .pipe(getFirstSucceededRemoteDataPayload())
      .subscribe(authorStats => {
        authorStats.page.forEach((facetValue: FacetValue) => {
          let updatedSearchUrl = facetValue?._links?.search?.href?.replace(this.halService.getRootHref() +
            '/discover', this.baseUrl);
          // remove `/objects` from the updatedSearchUrl
          updatedSearchUrl = updatedSearchUrl.replace('/objects', '');
          const fastSearchLink: FastSearchLink = Object.assign(new FastSearchLink(), {
            name: this.truncateText(facetValue.value),
            occurrences: facetValue.count,
            url: updatedSearchUrl
          });
          behaviorSubject.value.push(fastSearchLink);
        });
      });
  }

  /**
   * Load the UI url from the server configuration.
   */
  async getBaseUrl(): Promise<any> {
    return this.configurationService.findByPropertyName('dspace.ui.url')
      .pipe(getFirstSucceededRemoteDataPayload())
      .toPromise();
  }

  async assignBaseUrl() {
    this.baseUrl = await this.getBaseUrl()
      .then((baseUrlResponse: ConfigurationProperty) => {
        return baseUrlResponse?.values?.[0];
      });
  }

  redirectToSearch(searchValue) {
    this.router.navigateByUrl('/search?query=' + searchValue);
  }

  redirectToBrowseByField(field) {
    this.router.navigateByUrl('/browse/' + field);
  }

  /**
   * If the text is longer than MAX_TRUNCATE_LENGTH characters, replace the characters after
   * the MAX_TRUNCATE_LENGTHth index with '...' This method is used to truncate
   * the text in the `authors/subjects/languages` browsing section. We do not want
   * to display the full text of the author/subject/language, but only
   * the first MAX_TRUNCATE_LENGTH characters because it overflows to the next line.
   *
   * @param text
   * @private
   */
  private truncateText(text: string): string {
    if (text.length > MAX_TRUNCATE_LENGTH) {
      // Replace characters after the MAX_TRUNCATE_LENGTHth index with '...'
      return text.substring(0, MAX_TRUNCATE_LENGTH) + '...';
    } else {
      return text; // Return the original string if it's not longer than MAX_TRUNCATE_LENGTH characters
    }
  }
}

/**
 * Object for redirecting to the `authors/subjects/languages`
 */
// tslint:disable-next-line:max-classes-per-file
class FastSearchLink {
  name: string;
  occurrences: string;
  url: string;
}
