import { TestBed } from '@angular/core/testing';

import { ResolverStrategyService } from './resolver-strategy.service';

describe('ResolverStrategyService', () => {
  let service: ResolverStrategyService;

  const httpLink = 'http://rest.api/item';
  const httpsLink = 'https://rest.api/item';
  const ftpLink = 'ftp://rest.api/item';
  const ftpsLink = 'ftps://rest.api/item';
  const noProtocolLink = 'rest.api/item';

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(ResolverStrategyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should check if given value is a link', () => {
    expect(service.checkLink(httpLink)).toEqual(true);
    expect(service.checkLink(httpsLink)).toEqual(true);
    expect(service.checkLink(ftpLink)).toEqual(true);
    expect(service.checkLink(ftpsLink)).toEqual(true);
    expect(service.checkLink(noProtocolLink)).toEqual(false);
  });

  it('should return base URL if exists given URN', () => {
    expect(service.getBaseUrl('doi')).toBeTruthy();
    expect(service.getBaseUrl('FAKEURN')).toBeFalsy();
  });
});
