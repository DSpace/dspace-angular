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
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  BehaviorSubject,
  filter,
  Subscription,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { SortOptions } from '../../core/cache/models/sort-options.model';
import { ConfigurationDataService } from '../../core/data/configuration-data.service';
import { RemoteData } from '../../core/data/remote-data';
import { GroupDataService } from '../../core/eperson/group-data.service';
import { PaginationService } from '../../core/pagination/pagination.service';
import { LinkHeadService } from '../../core/services/link-head.service';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { SearchConfigurationService } from '../../core/shared/search/search-configuration.service';
import {
  hasValue,
  isUndefined,
} from '../empty.util';
import { SearchFilter } from '../search/models/search-filter.model';

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
  standalone: true,
  imports: [
    AsyncPipe,
    TranslateModule,
  ],
})
export class RSSComponent implements OnInit, OnDestroy, OnChanges {

  route$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  isEnabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  isActivated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
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
              protected paginationService: PaginationService,
              protected translateService: TranslateService) {
  }

  ngOnDestroy(): void {
    this.linkHeadService.removeTag("rel='alternate'");
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

    // Check if RSS is enabled
    this.subs.push(this.configurationService.findByPropertyName('websvc.opensearch.enable').pipe(
      getFirstCompletedRemoteData(),
    ).subscribe((result) => {
      if (result.hasSucceeded) {
        const enabled = (result.payload.values[0] === 'true');
        this.isEnabled$.next(enabled);

        // If enabled, get the OpenSearch URI
        if (enabled) {
          this.getOpenSearchUri();
        }
      }
    }));

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
   * Update RSS links based on current search configuration and sortConfig input
   */
  private updateRssLinks(): void {
    if (!this.openSearchUri || !this.isEnabled$.getValue()) {
      return;
    }

    // Remove existing link tags before adding new ones
    this.linkHeadService.removeTag("rel='alternate'");

    // Get the current search options and apply our sortConfig if provided
    const searchOptions = this.searchConfigurationService.paginatedSearchOptions.value;
    const modifiedOptions = { ...searchOptions };
    if (hasValue(this.sortConfig)) {
      modifiedOptions.sort = this.sortConfig;
    }

    // Create the RSS feed URL
    const route = environment.rest.baseUrl + this.formulateRoute(
      this.uuid,
      this.openSearchUri,
      modifiedOptions.sort,
      modifiedOptions.query,
      modifiedOptions.filters,
      modifiedOptions.configuration,
      modifiedOptions.pagination?.pageSize,
      modifiedOptions.fixedFilter,
    );

    // Add the link tags
    this.addLinks(route);

    // Add the OpenSearch service link
    this.linkHeadService.addTag({
      href: environment.rest.baseUrl + '/' + this.openSearchUri + '/service',
      type: 'application/atom+xml',
      rel: 'search',
      title: 'Dspace',
    });

    // Update the route subject
    this.route$.next(route);
  }

  /**
   * Create a route given the different params available to opensearch
   */
  formulateRoute(uuid: string, opensearch: string, sort?: SortOptions, query?: string, searchFilters?: SearchFilter[], configuration?: string, pageSize?: number, fixedFilter?: string): string {
    let route = 'format=atom';
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
   * Creates <link> tags in the header of the page
   */
  addLinks(route: string): void {
    this.linkHeadService.addTag({
      href: route,
      type: 'application/atom+xml',
      rel: 'alternate',
      title: 'Sitewide Atom feed',
    });
    route = route.replace('format=atom', 'format=rss');
    this.linkHeadService.addTag({
      href: route,
      type: 'application/rss+xml',
      rel: 'alternate',
      title: 'Sitewide RSS feed',
    });
  }
}
