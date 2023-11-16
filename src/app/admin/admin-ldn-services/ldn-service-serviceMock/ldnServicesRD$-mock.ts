import {LdnService} from '../ldn-services-model/ldn-services.model';
import {LDN_SERVICE} from '../ldn-services-model/ldn-service.resource-type';
import {RemoteData} from '../../../core/data/remote-data';
import {PaginatedList} from '../../../core/data/paginated-list.model';
import {Observable, of} from 'rxjs';
// Create a mock data object for a single LDN notify service
export const mockLdnService: LdnService = {
  id: 1,
  name: 'Service Name',
  description: 'Service Description',
  url: 'Service URL',
  ldnUrl: 'Service LDN URL',
  notifyServiceInboundPatterns: [
    {
      pattern: 'patternA',
      constraint: 'itemFilterA',
      automatic: false,
    },
    {
      pattern: 'patternB',
      constraint: 'itemFilterB',
      automatic: true,
    },
  ],
  notifyServiceOutboundPatterns: [
    {
      pattern: 'patternC',
      constraint: 'itemFilterC',
    },
  ],
  type: LDN_SERVICE,
  _links: {
    self: {
      href: 'http://localhost/api/ldn/ldnservices/1',
    },
  },
};


const mockLdnServices = {
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


// Create a mock ldnServicesRD$ observable
export const mockLdnServicesRD$: Observable<RemoteData<PaginatedList<LdnService>>> = of((mockLdnServices as unknown) as RemoteData<PaginatedList<LdnService>>);
