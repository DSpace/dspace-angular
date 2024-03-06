import { of as observableOf } from 'rxjs';
import { take } from 'rxjs/operators';

import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { createPaginatedList } from '../../shared/testing/utils.test';
import { ExternalSourceEntry } from '../shared/external-source-entry.model';
import { testSearchDataImplementation } from './base/search-data.spec';
import { ExternalSourceDataService } from './external-source-data.service';
import { GetRequest } from './request.models';

describe('ExternalSourceService', () => {
  let service: ExternalSourceDataService;

  let requestService;
  let rdbService;
  let halService;

  const entries = [
    Object.assign(new ExternalSourceEntry(), {
      id: '0001-0001-0001-0001',
      display: 'John Doe',
      value: 'John, Doe',
      metadata: {
        'dc.identifier.uri': [
          {
            value: 'https://orcid.org/0001-0001-0001-0001',
          },
        ],
      },
    }),
    Object.assign(new ExternalSourceEntry(), {
      id: '0001-0001-0001-0002',
      display: 'Sampson Megan',
      value: 'Sampson, Megan',
      metadata: {
        'dc.identifier.uri': [
          {
            value: 'https://orcid.org/0001-0001-0001-0002',
          },
        ],
      },
    }),
  ];

  function init() {
    requestService = jasmine.createSpyObj('requestService', {
      generateRequestId: 'request-uuid',
      send: {},
    });
    rdbService = jasmine.createSpyObj('rdbService', {
      buildList: createSuccessfulRemoteDataObject$(createPaginatedList(entries)),
    });
    halService = jasmine.createSpyObj('halService', {
      getEndpoint: observableOf('external-sources-REST-endpoint'),
    });
    service = new ExternalSourceDataService(requestService, rdbService, undefined, halService);
  }

  beforeEach(() => {
    init();
  });

  describe('composition', () => {
    const initService = () => new ExternalSourceDataService(null, null, null, null);
    testSearchDataImplementation(initService);
  });

  describe('getExternalSourceEntries', () => {

    describe('when no error response is cached', () => {
      let result;
      beforeEach(() => {
        spyOn(service, 'hasCachedErrorResponse').and.returnValue(observableOf(false));
        result = service.getExternalSourceEntries('test');
      });

      it('should send a GetRequest', () => {
        result.pipe(take(1)).subscribe();
        expect(requestService.send).toHaveBeenCalledWith(jasmine.any(GetRequest), true);
      });

      it('should return the entries', () => {
        result.subscribe((resultRD) => {
          expect(resultRD.payload.page).toBe(entries);
        });
      });
    });

    describe('when an error response is cached', () => {
      let result;
      beforeEach(() => {
        spyOn(service, 'hasCachedErrorResponse').and.returnValue(observableOf(true));
        result = service.getExternalSourceEntries('test');
      });

      it('should send a GetRequest', () => {
        result.pipe(take(1)).subscribe();
        expect(requestService.send).toHaveBeenCalledWith(jasmine.any(GetRequest), false);
      });
    });
  });
});
