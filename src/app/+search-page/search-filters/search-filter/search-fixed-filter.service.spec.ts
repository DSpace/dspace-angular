import { SearchFixedFilterService } from './search-fixed-filter.service';
import { RouteService } from '../../../shared/services/route.service';
import { RequestService } from '../../../core/data/request.service';
import { HALEndpointService } from '../../../core/shared/hal-endpoint.service';
import { of as observableOf } from 'rxjs';
import { RequestEntry } from '../../../core/data/request.reducer';
import { FilteredDiscoveryQueryResponse, RestResponse } from '../../../core/cache/response.models';

describe('SearchFixedFilterService', () => {
  let service: SearchFixedFilterService;

  const filterQuery = 'filter:query';

  const routeServiceStub = {} as RouteService;
  const requestServiceStub = Object.assign({
    /* tslint:disable:no-empty */
    configure: () => {},
    /* tslint:enable:no-empty */
    generateRequestId: () => 'fake-id',
    getByHref: () => observableOf(Object.assign(new RequestEntry(), {
      response: new FilteredDiscoveryQueryResponse(filterQuery, 200, 'OK')
    }))
  }) as RequestService;
  const halServiceStub = Object.assign(new HALEndpointService(requestServiceStub, undefined), {
    getEndpoint: () => observableOf('fake-url')
  });

  beforeEach(() => {
    service = new SearchFixedFilterService(routeServiceStub, requestServiceStub, halServiceStub);
  });

  describe('when getQueryByFilterName is called with a filterName', () => {
    it('should return the filter query', () => {
      service.getQueryByFilterName('filter').subscribe((query) => {
        expect(query).toBe(filterQuery);
      });
    });
  });

  describe('when getQueryByFilterName is called without a filterName', () => {
    it('should return undefined', () => {
      service.getQueryByFilterName(undefined).subscribe((query) => {
        expect(query).toBeUndefined();
      });
    });
  });

  describe('when getQueryByRelations is called', () => {
    const relationType = 'isRelationOf';
    const itemUUID = 'c5b277e6-2477-48bb-8993-356710c285f3';

    it('should contain the relationType and itemUUID', () => {
      const query = service.getQueryByRelations(relationType, itemUUID);
      expect(query.length).toBeGreaterThan(relationType.length + itemUUID.length);
      expect(query).toContain(relationType);
      expect(query).toContain(itemUUID);
    });
  });
});
