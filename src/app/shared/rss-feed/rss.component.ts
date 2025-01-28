import {
  AsyncPipe,
  NgIf,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  BehaviorSubject,
  Subscription,
} from 'rxjs';
import {
  map,
  switchMap,
} from 'rxjs/operators';

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
import { PaginatedSearchOptions } from '../search/models/paginated-search-options.model';
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
  imports: [NgIf, AsyncPipe, TranslateModule],
})
export class RSSComponent implements OnInit, OnDestroy  {

  route$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  isEnabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  isActivated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  uuid: string;

  subs: Subscription[] = [];

  constructor(private groupDataService: GroupDataService,
              private linkHeadService: LinkHeadService,
              private configurationService: ConfigurationDataService,
              private searchConfigurationService: SearchConfigurationService,
              private router: Router,
              private route: ActivatedRoute,
              protected paginationService: PaginationService,
              protected translateService: TranslateService) {
  }
  /**
   * Removes the linktag created when the component gets removed from the page.
   */
  ngOnDestroy(): void {
    this.linkHeadService.removeTag("rel='alternate'");
    this.subs.forEach(sub => {
      sub.unsubscribe();
    });
  }


  /**
   * Generates the link tags and the url to opensearch when the component is loaded.
   */
  ngOnInit(): void {
    if (hasValue(this.route.snapshot.data?.enableRSS)) {
      this.isActivated$.next(this.route.snapshot.data.enableRSS);
    } else if (isUndefined(this.route.snapshot.data?.enableRSS)) {
      this.isActivated$.next(false);
    }
    this.subs.push(this.configurationService.findByPropertyName('websvc.opensearch.enable').pipe(
      getFirstCompletedRemoteData(),
    ).subscribe((result) => {
      if (result.hasSucceeded) {
        const enabled = (result.payload.values[0] === 'true');
        this.isEnabled$.next(enabled);
      }
    }));
    this.subs.push(this.configurationService.findByPropertyName('websvc.opensearch.svccontext').pipe(
      getFirstCompletedRemoteData(),
      map((result: RemoteData<any>) => {
        if (result.hasSucceeded) {
          return result.payload.values[0];
        }
        return null;
      }),
      switchMap((openSearchUri: string) =>
        this.searchConfigurationService.paginatedSearchOptions.pipe(
          map((searchOptions: PaginatedSearchOptions) => ({ openSearchUri,  searchOptions })),
        ),
      ),
    ).subscribe(({ openSearchUri,  searchOptions }) => {
      if (!openSearchUri) {
        return null;
      }
      this.uuid = this.groupDataService.getUUIDFromString(this.router.url);
      const route = environment.rest.baseUrl + this.formulateRoute(this.uuid, openSearchUri, searchOptions.sort, searchOptions.query, searchOptions.filters, searchOptions.configuration, searchOptions.pagination?.pageSize, searchOptions.fixedFilter);
      this.addLinks(route);
      this.linkHeadService.addTag({
        href: environment.rest.baseUrl + '/' + openSearchUri + '/service',
        type: 'application/atom+xml',
        rel: 'search',
        title: 'Dspace',
      });
      this.route$.next(route);
    }));
  }

  /**
   * Function created a route given the different params available to opensearch
   * @param uuid The uuid if a scope is present
   * @param opensearch openSearch uri
   * @param sort The sort options for the opensearch request
   * @param query The query string that was provided in the search
   * @returns The combine URL to opensearch
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
      for (const filter of searchFilters) {
        for (const val of filter.values) {
          route += '&' + filter.key + '=' + encodeURIComponent(val) + (filter.operator ? ',' + filter.operator : '');
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
   * Check if the router url contains the specified route
   *
   * @param {string} route
   * @returns
   * @memberof MyComponent
   */
  hasRoute(route: string) {
    return this.router.url.includes(route);
  }

  /**
   * Creates <link> tags in the header of the page
   * @param route The composed url to opensearch
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
