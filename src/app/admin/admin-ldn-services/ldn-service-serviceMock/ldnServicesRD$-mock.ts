import {
  Observable,
  of,
} from 'rxjs';

import { PaginatedList } from '../../../core/data/paginated-list.model';
import { RemoteData } from '../../../core/data/remote-data';
import { createSuccessfulRemoteDataObject$ } from '../../../shared/remote-data.utils';
import { LDN_SERVICE } from '../ldn-services-model/ldn-service.resource-type';
import { LdnService } from '../ldn-services-model/ldn-services.model';

export const mockLdnService: LdnService = {
  uuid: '1',
  enabled: false,
  score: 0,
  id: 1,
  lowerIp: '192.0.2.146',
  upperIp: '192.0.2.255',
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
  type: LDN_SERVICE,
  _links: {
    self: {
      href: 'http://localhost/api/ldn/ldnservices/1',
    },
  },
  get self(): string {
    return '';
  },
};

export const mockLdnServiceRD$ = createSuccessfulRemoteDataObject$(mockLdnService);


export const mockLdnServices: LdnService[] = [{
  uuid: '1',
  enabled: false,
  score: 0,
  id: 1,
  lowerIp: '192.0.2.146',
  upperIp: '192.0.2.255',
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
  type: LDN_SERVICE,
  _links: {
    self: {
      href: 'http://localhost/api/ldn/ldnservices/1',
    },
  },
  get self(): string {
    return '';
  },
}, {
  uuid: '2',
  enabled: false,
  score: 0,
  id: 2,
  lowerIp: '192.0.2.146',
  upperIp: '192.0.2.255',
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
  type: LDN_SERVICE,
  _links: {
    self: {
      href: 'http://localhost/api/ldn/ldnservices/1',
    },
  },
  get self(): string {
    return '';
  },
},
];
export const mockLdnServicesRD$: Observable<RemoteData<PaginatedList<LdnService>>> = of((mockLdnServices as unknown) as RemoteData<PaginatedList<LdnService>>);
