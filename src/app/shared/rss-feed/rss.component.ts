import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import {BehaviorSubject, combineLatest as observableCombineLatest, Subscription} from 'rxjs';
import { GroupDataService } from '../../core/eperson/group-data.service';
import { LinkHeadService } from '../../core/services/link-head.service';
import { ConfigurationDataService } from '../../core/data/configuration-data.service';
import { getFirstSucceededRemoteDataPayload } from '../../core/shared/operators';
import { environment } from '../../../environments/environment';
import { SearchConfigurationService } from '../../core/shared/search/search-configuration.service';
import { PaginationService } from '../../core/pagination/pagination.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

/**
 * The RSS feed button component.
 *
 * This component needs four configuration variables.
 * - websvc.opensearch.enable = whether OpenSearch is enabled
 * - websvc.opensearch.svccontext = context for RSS/Atom request URLs
 * - websvc.opensearch.autolink = whether an autodiscovery link should be put into every page head
 * - websvc.opensearch.shortname = short name used in browsers for search service
 */
@Component({
  exportAs: 'rssComponent',
  selector: 'ds-rss',
  styleUrls: ['rss.component.scss'],
  templateUrl: 'rss.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.Emulated
})
export class RSSComponent implements OnInit, OnDestroy  {
  uuid: string;
  subs: Subscription[] = [];
  isEnabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  route$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private groupDataService: GroupDataService,
              private linkHeadService: LinkHeadService,
              private configurationService: ConfigurationDataService,
              private searchConfigurationService: SearchConfigurationService,
              private router: Router,
              protected paginationService: PaginationService) {
  }
  /**
   * Removes the link tag created when the component gets removed from the page.
   */
  ngOnDestroy(): void {
    this.linkHeadService.removeTag("rel='alternate'");
    this.subs.forEach(sub => {
      sub.unsubscribe();
    });
  }

  /**
   * Generates the link tags and the url to OpenSearch when the component is loaded
   * and injects these tags into the header tag.
   */
  ngOnInit(): void {
    this.subs.push(observableCombineLatest([
      this.configurationService.findByPropertyName('websvc.opensearch.enable')
        .pipe(getFirstSucceededRemoteDataPayload()),
      this.searchConfigurationService.paginatedSearchOptions,
      this.configurationService.findByPropertyName('websvc.opensearch.svccontext')
        .pipe(getFirstSucceededRemoteDataPayload()),
      this.configurationService.findByPropertyName('websvc.opensearch.autolink')
        .pipe(getFirstSucceededRemoteDataPayload()),
      this.configurationService.findByPropertyName('websvc.opensearch.shortname')
        .pipe(getFirstSucceededRemoteDataPayload())
    ]).pipe(
      map(([enable, searchOptions, svccontext, autolink, shortname]) => {
        return { enable, searchOptions, svccontext, autolink, shortname};
        }
      )).subscribe((r) => {
        const enabled = r.enable.values[0] === 'true';
        this.isEnabled$.next(enabled);
        if (!enabled) {
          // OpenSearch is disabled, abort
          return;
        }
        this.uuid = this.groupDataService.getUUIDFromString(this.router.url);
        const autolink = r.autolink.values[0] === 'true';
        const route = environment.rest.baseUrl + this.formulateRoute(this.uuid, r.svccontext.values[0], r.searchOptions.query);
        // Inject first two
        this.addLinks(route);
        if (autolink) {
          // Inject the third
          this.linkHeadService.addTag({
            href: environment.rest.baseUrl + '/opensearch/service',
            type: 'application/opensearchdescription+xml',
            rel: 'search',
            title: r.shortname.values[0]
          });
        }
        this.route$.next(route);
    }));
  }

  /**
   * Function that creates a route given params available to OpenSearch
   * @param {string} uuid The uuid if a scope is present
   * @param {string} opensearch openSearch uri
   * @param {string} query The query string that was provided in the search
   * @returns {string} The combine URL to OpenSearch
   */
  formulateRoute(uuid: string, opensearch: string, query: string): string {
    let route = '/' + opensearch + '?format=atom';
    if (uuid) {
      route += `&scope=${uuid}`;
    }
    if (query) {
      route += `&query=${query}`;
    } else {
      route += `&query=*`;
    }
    return route;
  }

  /**
   * Check if the router url contains the specified route
   * @param {string} route
   * @returns {boolean}
   */
  hasRoute(route: string): boolean {
    return this.router.url.includes(route);
  }

  /**
   * Creates <link> tags in the header of the page
   * @param route The composed url to OpenSearch
   */
  addLinks(route: string): void {
    this.linkHeadService.addTag({
      href: route,
      type: 'application/atom+xml',
      rel: 'alternate',
      title: 'Sitewide Atom feed'
    });
    route = route.replace('format=atom', 'format=rss');
    this.linkHeadService.addTag({
      href: route,
      type: 'application/rss+xml',
      rel: 'alternate',
      title: 'Sitewide RSS feed'
    });
  }
}
