import {
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { of } from 'rxjs';

import { APP_CONFIG } from '../../../config/app-config.interface';
import { DspaceRestService } from '../dspace-rest/dspace-rest.service';
import { SignpostingDataService } from './signposting-data.service';
import { SignpostingLink } from './signposting-links.model';

describe('SignpostingDataService', () => {
  let service: SignpostingDataService;
  let restServiceSpy: jasmine.SpyObj<DspaceRestService>;

  const mocklink = {
    href: 'http://test.org',
    rel: 'test',
    type: 'test',
  };

  const mocklink2 = {
    href: 'http://test2.org',
    rel: 'test',
    type: 'test',
  };

  const mockResponse: any = {
    statusCode: 200,
    payload: [mocklink, mocklink2],
  };

  const mockErrResponse: any = {
    statusCode: 500,
  };

  const environmentRest = {
    rest: {
      baseUrl: 'http://localhost:8080',
    },
  };

  beforeEach(() => {
    const restSpy = jasmine.createSpyObj('DspaceRestService', ['get', 'getWithHeaders']);

    TestBed.configureTestingModule({
      providers: [
        SignpostingDataService,
        { provide: APP_CONFIG, useValue: environmentRest },
        { provide: DspaceRestService, useValue: restSpy },
      ],
    });

    service = TestBed.inject(SignpostingDataService);
    restServiceSpy = TestBed.inject(DspaceRestService) as jasmine.SpyObj<DspaceRestService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return signposting links', fakeAsync(() => {
    const uuid = '123';
    const baseUrl = 'http://localhost:8080';

    restServiceSpy.get.and.returnValue(of(mockResponse));

    let result: SignpostingLink[];

    const expectedResult: SignpostingLink[] = [mocklink, mocklink2];

    service.getLinks(uuid).subscribe((links) => {
      result = links;
    });

    tick();

    expect(result).toEqual(expectedResult);
    expect(restServiceSpy.get).toHaveBeenCalledWith(`${baseUrl}/signposting/links/${uuid}`);
  }));

  it('should handle error and return an empty array', fakeAsync(() => {
    const uuid = '123';
    const baseUrl = 'http://localhost:8080';

    restServiceSpy.get.and.returnValue(of(mockErrResponse));

    let result: any;

    service.getLinks(uuid).subscribe((data) => {
      result = data;
    });

    tick();

    expect(result).toEqual([]);
    expect(restServiceSpy.get).toHaveBeenCalledWith(`${baseUrl}/signposting/links/${uuid}`);
  }));
});
