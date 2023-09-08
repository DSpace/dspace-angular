import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import {BehaviorSubject, Subscription} from 'rxjs';
import { GroupDataService } from '../../core/eperson/group-data.service';
import { LinkHeadService } from '../../core/services/link-head.service';
import { ConfigurationDataService } from '../../core/data/configuration-data.service';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteData,
  getFirstSucceededRemoteDataPayload,
} from '../../core/shared/operators';
import { environment } from '../../../environments/environment';
import { SearchConfigurationService } from '../../core/shared/search/search-configuration.service';
import { PaginationService } from '../../core/pagination/pagination.service';
import { Router } from '@angular/router';
import {map, switchMap} from 'rxjs/operators';
import { PaginatedSearchOptions } from '../search/models/paginated-search-options.model';
import { RemoteData } from '../../core/data/remote-data';
import { ConfigurationProperty } from '../../core/shared/configuration-property.model';


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
  // Give default value as DSpace
  shortname: BehaviorSubject<string> = new BehaviorSubject<string>('DSpace');
  autolink: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
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
   * Generates the link tags and the url to OpenSearch when the component is loaded.
   * And injects these tags into the header tag.
   */
  ngOnInit(): void {
    // Establish whether OpenSearch is enabled in the config
    this.getSucceededPropertyPayload('websvc.opensearch.enable', (result) => {
      this.isEnabled$.next(result.values[0] === 'true');
    });

    // If OpenSearch is disabled there is no need to proceed
    if (!this.isEnabled$) {
      return;
    }

    // Inject the three link tag into the header
    this.subs.push(this.configurationService.findByPropertyName('websvc.opensearch.svccontext')
      .pipe(getFirstSucceededRemoteData(),  map((result: RemoteData<ConfigurationProperty>) => result.payload.values[0]),
        switchMap((openSearchUri: string) => this.searchConfigurationService.paginatedSearchOptions
          .pipe(map((searchOptions: PaginatedSearchOptions) => ({ openSearchUri,  searchOptions })))),
        )
      .subscribe(({ openSearchUri,  searchOptions }) => {
          this.uuid = this.groupDataService.getUUIDFromString(this.router.url);

          // We cannot run succeeded property because this variable might not be set?
          this.getProperty('websvc.opensearch.autolink', (result) => {
            if (result.hasSucceeded) {
              this.autolink.next(result.payload.values[0] === 'true');
            }
          });

          const route = environment.rest.baseUrl + this.formulateRoute(this.uuid, openSearchUri, searchOptions.query);
          // Inject first two
          this.addLinks(route);

          if (this.autolink) {
            // We cannot run succeeded property because this variable might not be set?
            this.getProperty('websvc.opensearch.shortname', (result) => {
              if (result.hasSucceeded) {
                this.shortname.next(result.payload.values[0]);
              }
            });
            // Inject the third
            this.linkHeadService.addTag({
              href: environment.rest.baseUrl + '/opensearch/service',
              type: 'application/opensearchdescription+xml',
              rel: 'search',
              title: this.shortname.value
            });
          }
          this.route$.next(route);
        })
    );
  }

  /**
   * Utility function to retrieve a configuration property
   * @param {string} propertyname
   * @param {method} callback
   * @param {method} getmethod
   */
  getProperty(propertyname: string, callback: (result) => void, getmethod: any = getFirstCompletedRemoteData) {
    this.subs.push(this.configurationService.findByPropertyName(propertyname)
        .pipe(getmethod())
        .subscribe(callback));
  }

  /**
   * Utility method to retrieve a configuration property using getFirstSucceededRemoteDataPayload
   * @param {string} propertyname
   * @param {method} callback
   */
  getSucceededPropertyPayload(propertyname: string, callback: (result) => void)  {
    return this.getProperty(propertyname, callback, getFirstSucceededRemoteDataPayload);
  }

  /**
   * Function that creates a route given params available to OpenSearch
   * @param {string} uuid The uuid if a scope is present
   * @param {string} opensearch openSearch uri
   * @param {string} query The query string that was provided in the search
   * @returns {string} The combine URL to opensearch
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
   * @param route The composed url to opensearch
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
