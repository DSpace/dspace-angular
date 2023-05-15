import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { SignpostingDataService } from './signposting-data.service';
import { DspaceRestService } from '../dspace-rest/dspace-rest.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { of } from 'rxjs';
import { SignpostingLink } from './signposting-links.model';

describe('SignpostingDataService', () => {
  let service: SignpostingDataService;
  let restServiceSpy: jasmine.SpyObj<DspaceRestService>;
  let halServiceSpy: jasmine.SpyObj<HALEndpointService>;
  const mocklink = {
    href: 'http://test.org',
    rel: 'test',
    type: 'test'
  };

  const mocklink2 = {
    href: 'http://test2.org',
    rel: 'test',
    type: 'test'
  };

  const mockResponse: any = {
    statusCode: 200,
    payload: [mocklink, mocklink2]
  };

  const mockErrResponse: any = {
    statusCode: 500
  };

  beforeEach(() => {
    const restSpy = jasmine.createSpyObj('DspaceRestService', ['get', 'getWithHeaders']);
    const halSpy = jasmine.createSpyObj('HALEndpointService', ['getRootHref']);

    TestBed.configureTestingModule({
      providers: [
        SignpostingDataService,
        { provide: DspaceRestService, useValue: restSpy },
        { provide: HALEndpointService, useValue: halSpy }
      ]
    });

    service = TestBed.inject(SignpostingDataService);
    restServiceSpy = TestBed.inject(DspaceRestService) as jasmine.SpyObj<DspaceRestService>;
    halServiceSpy = TestBed.inject(HALEndpointService) as jasmine.SpyObj<HALEndpointService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return signposting links', fakeAsync(() => {
    const uuid = '123';
    const baseUrl = 'http://localhost:8080';

    halServiceSpy.getRootHref.and.returnValue(`${baseUrl}/api`);

    restServiceSpy.get.and.returnValue(of(mockResponse));

    let result: SignpostingLink[];

    const expectedResult: SignpostingLink[] = [mocklink, mocklink2];

    service.getLinks(uuid).subscribe((links) => {
      result = links;
    });

    tick();

    expect(result).toEqual(expectedResult);
    expect(halServiceSpy.getRootHref).toHaveBeenCalled();
    expect(restServiceSpy.get).toHaveBeenCalledWith(`${baseUrl}/signposting/links/${uuid}`);
  }));

  it('should handle error and return an empty array', fakeAsync(() => {
    const uuid = '123';
    const baseUrl = 'http://localhost:8080';

    halServiceSpy.getRootHref.and.returnValue(`${baseUrl}/api`);

    restServiceSpy.get.and.returnValue(of(mockErrResponse));

    let result: any;

    service.getLinks(uuid).subscribe((data) => {
      result = data;
    });

    tick();

    expect(result).toEqual([]);
    expect(halServiceSpy.getRootHref).toHaveBeenCalled();
    expect(restServiceSpy.get).toHaveBeenCalledWith(`${baseUrl}/signposting/links/${uuid}`);
  }));
});
