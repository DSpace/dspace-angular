import { SearchFixedFilterService } from './search-fixed-filter.service';
import { RequestService } from '../../../core/data/request.service';
import { of as observableOf } from 'rxjs';
import { RequestEntry } from '../../../core/data/request.reducer';
import { FilteredDiscoveryQueryResponse } from '../../../core/cache/response.models';

describe('SearchFixedFilterService', () => {
  let service: SearchFixedFilterService;

  const filterQuery = 'filter:query';

  const requestServiceStub = Object.assign({
    /* tslint:disable:no-empty */
    configure: () => {
    },
    /* tslint:enable:no-empty */
    generateRequestId: () => 'fake-id',
    getByHref: () => observableOf(Object.assign(new RequestEntry(), {
      response: new FilteredDiscoveryQueryResponse(filterQuery, 200, 'OK')
    }))
  }) as RequestService;

  beforeEach(() => {
    service = new SearchFixedFilterService();
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
