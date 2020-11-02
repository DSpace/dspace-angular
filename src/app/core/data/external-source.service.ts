import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { ExternalSource } from '../shared/external-source.model';
import { RequestService } from './request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../core.reducers';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { FindListOptions, GetRequest } from './request.models';
import { Observable } from 'rxjs/internal/Observable';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { PaginatedSearchOptions } from '../../shared/search/paginated-search-options.model';
import { hasValue, isNotEmptyOperator } from '../../shared/empty.util';
import { configureRequest } from '../shared/operators';
import { RemoteData } from './remote-data';
import { PaginatedList } from './paginated-list';
import { ExternalSourceEntry } from '../shared/external-source-entry.model';
import { DefaultChangeAnalyzer } from './default-change-analyzer.service';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';

// TEST
import { ResourceType } from '../shared/resource-type';
import { PageInfo } from '../shared/page-info.model';
import { createSuccessfulRemoteDataObject } from '../../shared/remote-data.utils';
import { of as observableOf } from 'rxjs';

/**
 * A service handling all external source requests
 */
@Injectable()
export class ExternalSourceService extends DataService<ExternalSource> {
  protected linkPath = 'externalsources';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DefaultChangeAnalyzer<ExternalSource>) {
    super();
  }

  /**
   * Get the endpoint to browse external sources
   * @param options
   * @param linkPath
   */
  getBrowseEndpoint(options: FindListOptions = {}, linkPath: string = this.linkPath): Observable<string> {
    return this.halService.getEndpoint(linkPath);
  }

  /**
   * Get the endpoint for an external source's entries
   * @param externalSourceId  The id of the external source to fetch entries for
   */
  getEntriesEndpoint(externalSourceId: string): Observable<string> {
    return this.getBrowseEndpoint().pipe(
      map((href) => this.getIDHref(href, externalSourceId)),
      switchMap((href) => this.halService.getEndpoint('entries', href))
    );
  }

  /**
   * Get the entries for an external source
   * @param externalSourceId  The id of the external source to fetch entries for
   * @param searchOptions     The search options to limit results to
   */
  getExternalSourceEntries(externalSourceId: string, searchOptions?: PaginatedSearchOptions): Observable<RemoteData<PaginatedList<ExternalSourceEntry>>> {
    const requestUuid = this.requestService.generateRequestId();

    const href$ = this.getEntriesEndpoint(externalSourceId).pipe(
      isNotEmptyOperator(),
      distinctUntilChanged(),
      map((endpoint: string) => hasValue(searchOptions) ? searchOptions.toRestUrl(endpoint) : endpoint)
    );

    href$.pipe(
      map((endpoint: string) => new GetRequest(requestUuid, endpoint)),
      configureRequest(this.requestService)
    ).subscribe();

    return this.rdbService.buildList(href$);
  }

  // FOR TEST

  searchBy2(searchMethod: string, options: FindListOptions, ...linksToFollow: Array<FollowLinkConfig<ExternalSourceEntry>>): Observable<RemoteData<PaginatedList<ExternalSourceEntry>>> {
    // Libray of congress, pubmed, arXiv, Scopus, OpenAIRE
    // sherpa journal sherpa publisher epo ORCID

    const externalSourceLoC: ExternalSource = {
      type: new ResourceType('externalsource'),
      id: 'lcname',
      name: 'lcname',
      hierarchical: false,
      _links: {
        entries: {
          href: 'https://dspace7.4science.cloud/server/api/integration/externalsources/lcname/entries'
        },
        self: {
          href: 'https://dspace7.4science.cloud/server/api/integration/externalsources/lcname'
        }
      }
    };
    const externalSourcePub: ExternalSource = {
      type: new ResourceType('externalsource'),
      id: 'pubmed',
      name: 'pubmed',
      hierarchical: false,
      _links: {
        entries: {
          href: 'https://dspace7.4science.cloud/server/api/integration/externalsources/pubmed/entries'
        },
        self: {
          href: 'https://dspace7.4science.cloud/server/api/integration/externalsources/pubmed'
        }
      }
    };
    const externalSourceArXiv: ExternalSource = {
      type: new ResourceType('externalsource'),
      id: 'arxiv',
      name: 'arxiv',
      hierarchical: false,
      _links: {
        entries: {
          href: 'https://dspace7.4science.cloud/server/api/integration/externalsources/arxiv/entries'
        },
        self: {
          href: 'https://dspace7.4science.cloud/server/api/integration/externalsources/arxiv'
        }
      }
    };
    const externalSourceScopus: ExternalSource = {
      type: new ResourceType('externalsource'),
      id: 'scopus',
      name: 'scopus',
      hierarchical: false,
      _links: {
        entries: {
          href: 'https://dspace7.4science.cloud/server/api/integration/externalsources/scopus/entries'
        },
        self: {
          href: 'https://dspace7.4science.cloud/server/api/integration/externalsources/scopus'
        }
      }
    };
    const externalSourceOpenAIRE: ExternalSource = {
      type: new ResourceType('externalsource'),
      id: 'openaire',
      name: 'openaire',
      hierarchical: false,
      _links: {
        entries: {
          href: 'https://dspace7.4science.cloud/server/api/integration/externalsources/openaire/entries'
        },
        self: {
          href: 'https://dspace7.4science.cloud/server/api/integration/externalsources/openaire'
        }
      }
    };
    const externalSourceSherpaJ: ExternalSource = {
      type: new ResourceType('externalsource'),
      id: 'sherpaJournal',
      name: 'sherpaJournal',
      hierarchical: false,
      _links: {
        entries: {
          href: 'https://dspace7.4science.cloud/server/api/integration/externalsources/sherpaJournal/entries'
        },
        self: {
          href: 'https://dspace7.4science.cloud/server/api/integration/externalsources/sherpaJournal'
        }
      }
    };
    const externalSourceSherpaP: ExternalSource = {
      type: new ResourceType('externalsource'),
      id: 'sherpaPublisher',
      name: 'sherpaPublisher',
      hierarchical: false,
      _links: {
        entries: {
          href: 'https://dspace7.4science.cloud/server/api/integration/externalsources/sherpaPublisher/entries'
        },
        self: {
          href: 'https://dspace7.4science.cloud/server/api/integration/externalsources/sherpaPublisher'
        }
      }
    };
    const externalSourceEpo: ExternalSource = {
      type: new ResourceType('externalsource'),
      id: 'epo',
      name: 'epo',
      hierarchical: false,
      _links: {
        entries: {
          href: 'https://dspace7.4science.cloud/server/api/integration/externalsources/epo/entries'
        },
        self: {
          href: 'https://dspace7.4science.cloud/server/api/integration/externalsources/epo'
        }
      }
    };
    const externalSourceOrcid: ExternalSource = {
      type: new ResourceType('externalsource'),
      id: 'orcid',
      name: 'orcid',
      hierarchical: false,
      _links: {
        entries: {
          href: 'https://dspace7.4science.cloud/server/api/integration/externalsources/orcid/entries'
        },
        self: {
          href: 'https://dspace7.4science.cloud/server/api/integration/externalsources/orcid'
        }
      }
    };

    const pageInfo = new PageInfo({
      elementsPerPage: 5,
      totalElements: 0,
      totalPages: 0,
      currentPage: 1
    });
    let array = [ ];

    switch (options.searchParams[0].fieldValue) {
      case 'Dataset': {
        pageInfo.totalElements = 5;
        pageInfo.totalPages = 1;
        array = [ externalSourceLoC, externalSourcePub, externalSourceArXiv, externalSourceScopus, externalSourceOpenAIRE ];
        break;
      }
      case 'Equipment': {
        pageInfo.totalElements = 5;
        pageInfo.totalPages = 1;
        array = [ externalSourceLoC, externalSourcePub, externalSourceArXiv, externalSourceScopus, externalSourceOpenAIRE ];
        break;
      }
      case 'Event': {
        pageInfo.totalElements = 5;
        pageInfo.totalPages = 1;
        array = [ externalSourceLoC, externalSourcePub, externalSourceArXiv, externalSourceScopus, externalSourceOpenAIRE ];
        break;
      }
      case 'Funding': {
        pageInfo.totalElements = 5;
        pageInfo.totalPages = 1;
        array = [ externalSourceLoC, externalSourcePub, externalSourceArXiv, externalSourceScopus, externalSourceOpenAIRE ];
        break;
      }
      case 'Journal': {
        pageInfo.totalElements = 1;
        pageInfo.totalPages = 1;
        array = [ externalSourceSherpaJ ];
        break;
      }
      case 'OrgUnit': {
        pageInfo.totalElements = 1;
        pageInfo.totalPages = 1;
        array = [ externalSourceSherpaP ];
        break;
      }
      case 'Patent': {
        pageInfo.totalElements = 1;
        pageInfo.totalPages = 1;
        array = [ externalSourceEpo ];
        break;
      }
      case 'Person': {
        pageInfo.totalElements = 1;
        pageInfo.totalPages = 1;
        array = [ externalSourceOrcid ];
        break;
      }
      case 'Project': {
        pageInfo.totalElements = 5;
        pageInfo.totalPages = 1;
        array = [ externalSourceLoC, externalSourcePub, externalSourceArXiv, externalSourceScopus, externalSourceOpenAIRE ];
        break;
      }
      case 'Publication': {
        pageInfo.totalElements = 5;
        pageInfo.totalPages = 1;
        array = [ externalSourceLoC, externalSourcePub, externalSourceArXiv, externalSourceScopus, externalSourceOpenAIRE ];
        break;
      }
    };
    const paginatedList = new PaginatedList(pageInfo, array);
    const paginatedListRD = createSuccessfulRemoteDataObject(paginatedList);
    return observableOf(paginatedListRD);;
  }
}
