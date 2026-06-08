import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
} from '@angular/router';
import { SortOptions } from '@dspace/core/cache/models/sort-options.model';
import { ConfigurationDataService } from '@dspace/core/data/configuration-data.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { GroupDataService } from '@dspace/core/eperson/group-data.service';
import { PaginationService } from '@dspace/core/pagination/pagination.service';
import { LinkHeadService } from '@dspace/core/services/link-head.service';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import { SearchFilter } from '@dspace/core/shared/search/models/search-filter.model';
import {
  hasValue,
  isUndefined,
} from '@dspace/shared/utils/empty.util';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  BehaviorSubject,
  filter,
  forkJoin,
  Subscription,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { DSpaceObjectDataService } from '../../core/data/dspace-object-data.service';
import { Collection } from '../../core/shared/collection.model';
import { Community } from '../../core/shared/community.model';
import { SearchConfigurationService } from '../search/search-configuration.service';

/**
 * Mapping of supported OpenSearch feed formats to their MIME types.
 */
const OPENSEARCH_FORMAT_MIME_TYPES: Record<string, string> = {
  atom: 'application/atom+xml',
  rss:  'application/rss+xml',
};
/**
 * The Rss feed button component.
 */
@Component({
  exportAs: 'rssComponent',
  selector: 'ds-rss',
  styleUrls: ['rss.component.scss'],
  templateUrl: 'rss.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated,
  imports: [
    AsyncPipe,
    TranslateModule,
  ],
})
export class RSSComponent implements OnInit, OnDestroy, OnChanges {

  route$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  isEnabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  isActivated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  formats$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  @Input() sortConfig?: SortOptions;

  uuid: string;
  subs: Subscription[] = [];
  openSearchUri: string;

  constructor(private groupDataService: GroupDataService,
              private linkHeadService: LinkHeadService,
              private configurationService: ConfigurationDataService,
              private searchConfigurationService: SearchConfigurationService,
              private router: Router,
              private route: ActivatedRoute,
              private dsoNameService: DSONameService,
              private dspaceObjectService: DSpaceObjectDataService,
              protected paginationService: PaginationService,
              protected translateService: TranslateService) {
  }

  ngOnDestroy(): void {
    this.linkHeadService.removeTag("rel='alternate'");
    this.linkHeadService.removeTag("rel='search'");
    this.subs.forEach(sub => {
      sub.unsubscribe();
    });
  }

  ngOnInit(): void {
    // Set initial activation state
    if (hasValue(this.route.snapshot.data?.enableRSS)) {
      this.isActivated$.next(this.route.snapshot.data.enableRSS);
    } else if (isUndefined(this.route.snapshot.data?.enableRSS)) {
      this.isActivated$.next(false);
    }

    // Get initial UUID from URL
    this.uuid = this.groupDataService.getUUIDFromString(this.router.url);

    // Check if RSS is enabled, and if so fetch the supported formats in one
    // combined subscription so that both values are always consistent with
    // each other.
    this.subs.push(
      forkJoin([
        this.configurationService.findByPropertyName('websvc.opensearch.enable').pipe(
          getFirstCompletedRemoteData(),
        ),
        this.configurationService.findByPropertyName('websvc.opensearch.formats').pipe(
          getFirstCompletedRemoteData(),
        ),
      ]).subscribe(([enableResult, formatsResult]) => {
        if (!enableResult.hasSucceeded || enableResult.payload.values[0] !== 'true') {
          this.isEnabled$.next(false);
          return;
        }

        const rawFormats: string[] = formatsResult.hasSucceeded ? formatsResult.payload.values : [];

        const knownFormats = rawFormats.filter(f => f in OPENSEARCH_FORMAT_MIME_TYPES);

        if (knownFormats.length === 0) {
          console.warn(
            'RSSComponent: websvc.opensearch.formats contains no recognised formats ' +
            `(received: [${rawFormats.join(', ')}]). Disabling RSS feed.`,
          );
          this.isEnabled$.next(false);
          return;
        }

        this.formats$.next(knownFormats);
        this.isEnabled$.next(true);
        this.getOpenSearchUri();
      }),
    );

    // Listen for navigation events to update the UUID
    this.subs.push(this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
    ).subscribe(() => {
      this.uuid = this.groupDataService.getUUIDFromString(this.router.url);
      this.updateRssLinks();
    }));
  }

  ngOnChanges(changes: SimpleChanges): void {
    // If sortConfig changes, update the RSS links
    if (changes.sortConfig && this.openSearchUri && this.isEnabled$.getValue()) {
      this.updateRssLinks();
    }
  }

  /**
   * Get the OpenSearch URI and update RSS links
   */
  private getOpenSearchUri(): void {
    this.subs.push(this.configurationService.findByPropertyName('websvc.opensearch.svccontext').pipe(
      getFirstCompletedRemoteData(),
      map((result: RemoteData<any>) => {
        if (result.hasSucceeded) {
          return result.payload.values[0];
        }
        return null;
      }),
      filter(uri => !!uri),
    ).subscribe(uri => {
      this.openSearchUri = uri;
      this.updateRssLinks();
    }));
  }

  /**
   * Update RSS links based on current search configuration and sortConfig input.
   */
  private updateRssLinks(): void {
    if (!this.openSearchUri || !this.isEnabled$.getValue()) {
      return;
    }

    const formats = this.formats$.getValue();
    if (formats.length === 0) {
      return;
    }

    const searchOptions = this.searchConfigurationService.paginatedSearchOptions.value;
    const modifiedOptions = { ...searchOptions };
    if (hasValue(this.sortConfig)) {
      modifiedOptions.sort = this.sortConfig;
    }

    this.addLinks(
      this.uuid,
      this.openSearchUri,
      formats,
      modifiedOptions.sort,
      modifiedOptions.query,
      modifiedOptions.filters,
      modifiedOptions.configuration,
      modifiedOptions.pagination?.pageSize,
      modifiedOptions.fixedFilter,
    );

    this.route$.next(
      environment.rest.baseUrl + this.formulateRoute(this.uuid, this.openSearchUri, formats[0], modifiedOptions.sort, modifiedOptions.query, modifiedOptions.filters, modifiedOptions.configuration, modifiedOptions.pagination?.pageSize, modifiedOptions.fixedFilter),
    );
  }

  /**
   * Create a route given the different params available to opensearch.
   */
  formulateRoute(uuid: string, opensearch: string, format: string, sort?: SortOptions, query?: string, searchFilters?: SearchFilter[], configuration?: string, pageSize?: number, fixedFilter?: string): string {
    let route = `format=${format}`;
    if (uuid) {
      route += `&scope=${uuid}`;
    }
    if (sort && sort.direction && sort.field && sort.field !== 'id') {
      route += `&sort=${sort.field}&sort_direction=${sort.direction}`;
    }
    if (query) {
      route += `&query=${query}`;
    } else {
      route += `&query=*`;
    }
    if (configuration) {
      route += `&configuration=${configuration}`;
    }
    if (pageSize) {
      route += `&rpp=${pageSize}`;
    }
    if (searchFilters) {
      for (const searchFilter of searchFilters) {
        for (const val of searchFilter.values) {
          route += '&' + searchFilter.key + '=' + encodeURIComponent(val) + (searchFilter.operator ? ',' + searchFilter.operator : '');
        }
      }
    }
    if (fixedFilter) {
      route += '&' + fixedFilter;
    }
    route = '/' + opensearch + '?' + route;
    return route;
  }

  /**
   * Creates the valid link in
   */
  addLinks(uuid: string, opensearch: string, formats: string[], sort?: SortOptions, query?: string, searchFilters?: SearchFilter[], configuration?: string, pageSize?: number, fixedFilter?: string): void {
    this.linkHeadService.removeTag("rel='alternate'");
    this.linkHeadService.removeTag("rel='search'");

    // Resolve feed title label and add rel='alternate' tags
    if (uuid) {
      this.dspaceObjectService.findById(uuid).pipe(
        getFirstCompletedRemoteData(),
      ).subscribe((result) => {
        let scopeLabel: string;
        if (result.hasSucceeded) {
          scopeLabel = this.dsoNameService.getName(result.payload);
        } else {
          scopeLabel = 'Sitewide';
        }
        this.linkHeadService.removeTag("rel='alternate'");
        for (const format of formats) {
          const href = environment.rest.baseUrl + this.formulateRoute(uuid, opensearch, format, sort, query, searchFilters, configuration, pageSize, fixedFilter);
          this.linkHeadService.addTag({
            href,
            type: OPENSEARCH_FORMAT_MIME_TYPES[format],
            rel: 'alternate',
            title: `${scopeLabel} ${format.charAt(0).toUpperCase() + format.slice(1)} Feed`.trim(),
          });
        }
      });
    } else {
      const scopeLabel = this.router.url.includes('/search') ? 'Search results' : 'Sitewide';
      for (const format of formats) {
        const href = environment.rest.baseUrl + this.formulateRoute(uuid, opensearch, format, sort, query, searchFilters, configuration, pageSize, fixedFilter);
        this.linkHeadService.addTag({
          href,
          type: OPENSEARCH_FORMAT_MIME_TYPES[format],
          rel: 'alternate',
          title: `${scopeLabel} ${format.charAt(0).toUpperCase() + format.slice(1)} Feed`,
        });
      }
    }

    // Service discovery link uses the primary (first) format
    this.linkHeadService.addTag({
      href: environment.rest.baseUrl + '/' + opensearch.split('/search')[0] || '' + '/service',
      type: OPENSEARCH_FORMAT_MIME_TYPES[formats[0]],
      rel: 'search',
      title: 'DSpace OpenSearch',
    });
  }
}
