import { followLink } from '../../shared/utils/follow-link-config.model';
import { EMPTY } from 'rxjs';
import { FindListOptions } from '../data/find-list-options.model';
import { BrowseLinkDataService } from './browse-link-data.service';

describe(`BrowseLinkDataService`, () => {
  let service: BrowseLinkDataService;
  const findAllDataSpy = jasmine.createSpyObj('findAllData', {
    findAll: EMPTY,
  });
  const options = new FindListOptions();
  const linksToFollow = [
    followLink('entries'),
    followLink('items')
  ];

  beforeEach(() => {
    service = new BrowseLinkDataService(null, null, null, null, null);
    (service as any).findAllData = findAllDataSpy;
  });

  describe(`getBrowseLinkFor`, () => {
    it(`should call findAll on findAllData`, () => {
      service.getBrowseLinkFor(['dc.test']);
      expect(findAllDataSpy.findAll).toHaveBeenCalledWith({ elementsPerPage: 9999 });
    });
  });
});
