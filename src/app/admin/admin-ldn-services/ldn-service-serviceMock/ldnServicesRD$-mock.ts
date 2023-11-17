import {LdnService} from '../ldn-services-model/ldn-services.model';
import {LDN_SERVICE} from '../ldn-services-model/ldn-service.resource-type';
import {RemoteData} from '../../../core/data/remote-data';
import {PaginatedList} from '../../../core/data/paginated-list.model';
import {Observable, of} from "rxjs";
import {createSuccessfulRemoteDataObject$} from "../../../shared/remote-data.utils";

export const mockLdnService: LdnService = {
  uuid: "1",
  enabled: false,
  score: 0,
  id: 1,
  name: 'Service Name',
  description: 'Service Description',
  url: 'Service URL',
  ldnUrl: 'Service LDN URL',
  notifyServiceInboundPatterns: [
    {
      pattern: 'patternA',
      constraint: 'itemFilterA',
      automatic: 'false',
    },
    {
      pattern: 'patternB',
      constraint: 'itemFilterB',
      automatic: 'true',
    },
  ],
  notifyServiceOutboundPatterns: [
    {
      pattern: 'patternC',
      constraint: 'itemFilterC',
      automatic: 'true',
    },
  ],
  type: LDN_SERVICE,
  _links: {
    self: {
      href: 'http://localhost/api/ldn/ldnservices/1'
    },
  },
  get self(): string {
    return "";
  },
};

//export const mockLdnServiceRD$: Observable<RemoteData<PaginatedList<LdnService>>> = of((mockLdnService as unknown) as RemoteData<PaginatedList<LdnService>>);
//export const mockLdnServiceRD$ = createSuccessfulRemoteDataObject$(createPaginatedList(mockLdnService[0])as  PaginatedList<LdnService>);
export const mockLdnServiceRD$ = createSuccessfulRemoteDataObject$(mockLdnService);


export const mockLdnServices: LdnService[] = [{
  uuid: "1",
  enabled: false,
  score: 0,
  id: 1,
  name: 'Service Name',
  description: 'Service Description',
  url: 'Service URL',
  ldnUrl: 'Service LDN URL',
  notifyServiceInboundPatterns: [
    {
      pattern: 'patternA',
      constraint: 'itemFilterA',
      automatic: 'false',
    },
    {
      pattern: 'patternB',
      constraint: 'itemFilterB',
      automatic: 'true',
    },
  ],
  notifyServiceOutboundPatterns: [
    {
      pattern: 'patternC',
      constraint: 'itemFilterC',
      automatic: 'true',
    },
  ],
  type: LDN_SERVICE,
  _links: {
    self: {
      href: 'http://localhost/api/ldn/ldnservices/1'
    },
  },
  get self(): string {
    return "";
  },
},{
  uuid: "2",
  enabled: false,
  score: 0,
  id: 2,
  name: 'Service Name',
  description: 'Service Description',
  url: 'Service URL',
  ldnUrl: 'Service LDN URL',
  notifyServiceInboundPatterns: [
    {
      pattern: 'patternA',
      constraint: 'itemFilterA',
      automatic: 'false',
    },
    {
      pattern: 'patternB',
      constraint: 'itemFilterB',
      automatic: 'true',
    },
  ],
  notifyServiceOutboundPatterns: [
    {
      pattern: 'patternC',
      constraint: 'itemFilterC',
      automatic: 'true',
    },
  ],
  type: LDN_SERVICE,
  _links: {
    self: {
      href: 'http://localhost/api/ldn/ldnservices/1'
    },
  },
  get self(): string {
    return "";
  },
}
]
export const mockLdnServicesRD$: Observable<RemoteData<PaginatedList<LdnService>>> = of((mockLdnServices as unknown) as RemoteData<PaginatedList<LdnService>>);


/*export const mockLdnServiceRD$: RemoteData<PaginatedList<LdnService>> = {
  errorMessage: null,
  lastUpdated: 1700176600821,
  msToLive: 900000,
  payload: {
    page: [mockLdnService],
    pageInfo: {
      elementsPerPage: 20,
      totalPages: 1,
      totalElements: 1,
      currentPage: 1,
    },
    type: {value: "paginated-list"},
    _links: {
      self: {
        href: "http://localhost:8080/server/api/ldn/ldnservices?size=20&sort=dc.title,ASC"
      },
      page: [
        {
          "href": "http://localhost/api/ldn/ldnservices/1"
        }
      ]
    },
  },
  statusCode: 200,
  state: 'Success',
  timeCompleted: 1700176600821,
}*/



const mockLdnServices2 = {
  payload: {
    elementsPerPage: 20,
    totalPages: 1,
    totalElements: 1,
    currentPage: 1,
    first: undefined,
    prev: undefined,
    next: undefined,
    last: undefined,
    page: [mockLdnService],
    type: LDN_SERVICE,
    self: undefined,
    getPageLength: function () {
      return this.page.length;
    },
    _links: {
      self: {
        href: 'http://localhost/api/ldn/ldnservices/1',
      },
      page: [],
    },
  },
  hasSucceeded: true,
  msToLive: 0,
};
