import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GroupDataService } from '../../core/eperson/group-data.service';
import { LinkHeadService } from '../../core/services/link-head.service';
import { ConfigurationDataService } from '../../core/data/configuration-data.service';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { environment } from '../../../../src/environments/environment';
import { SearchConfigurationService } from '../../core/shared/search/search-configuration.service';
import { SortOptions } from '../../core/cache/models/sort-options.model';
import { PaginationService } from '../../core/pagination/pagination.service';


/**
 * The default pagination controls component.
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

  route$: BehaviorSubject<string>;

  isEnabled$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  uuid: string;
  configuration$: Observable<string>;
  sortOption$: Observable<SortOptions>;

  constructor(private groupDataService: GroupDataService,
              private linkHeadService: LinkHeadService,
              private configurationService: ConfigurationDataService,
              private searchConfigurationService: SearchConfigurationService,
              protected paginationService: PaginationService) {
  }
  ngOnDestroy(): void {
    this.linkHeadService.removeTag("rel='alternate'");
  }

  ngOnInit(): void {
    this.configuration$ = this.searchConfigurationService.getCurrentConfiguration('default');

    this.configurationService.findByPropertyName('websvc.opensearch.enable').pipe(
      getFirstCompletedRemoteData(),
    ).subscribe((result) => {
      const enabled = Boolean(result.payload.values[0]);
      this.isEnabled$.next(enabled);
    });

    this.searchConfigurationService.getCurrentQuery('').subscribe((query) => {
      this.sortOption$ = this.paginationService.getCurrentSort(this.searchConfigurationService.paginationID, null, true);
      this.sortOption$.subscribe((sort) => {
        this.uuid = this.groupDataService.getUUIDFromString(window.location.href);

        const route = environment.rest.baseUrl + this.formulateRoute(this.uuid, sort, query);

        this.linkHeadService.addTag({
          href: route,
          type: 'application/atom+xml',
          rel: 'alternate',
          title: 'Sitewide Atom feed'
        });
        this.route$ = new BehaviorSubject<string>(route);
      });
    });
  }

  formulateRoute(uuid: string, sort: SortOptions, query: string): string {
    let route = 'search?format=atom';
    if (uuid) {
      route += `&scope=${uuid}`;
    }
    if (sort.direction && sort.field) {
      route += `&sort=${sort.field}&sort_direction=${sort.direction}`;
    }
    if (query) {
      route += `&query=${query}`;
    } else {
      route += `&query=*`;
    }
    route = '/opensearch/' + route;
    return route;
  }
}
