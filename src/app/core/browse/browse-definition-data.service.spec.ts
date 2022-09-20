import { BrowseDefinitionDataService } from './browse-definition-data.service';
import { followLink } from '../../shared/utils/follow-link-config.model';
import { EMPTY } from 'rxjs';
import { FindListOptions } from '../data/find-list-options.model';

describe(`BrowseDefinitionDataService`, () => {
  let service: BrowseDefinitionDataService;
  const findAllDataSpy = jasmine.createSpyObj('findAllData', {
    findAll: EMPTY,
  });
  const options = new FindListOptions();
  const linksToFollow = [
    followLink('entries'),
    followLink('items')
  ];

  beforeEach(() => {
    service = new BrowseDefinitionDataService(null, null, null, null);
    (service as any).findAllData = findAllDataSpy;
  });

  describe(`findAll`, () => {
    it(`should call findAll on findAllData`, () => {
      service.findAll(options, true, false, ...linksToFollow);
      expect(findAllDataSpy.findAll).toHaveBeenCalledWith(options, true, false, ...linksToFollow);
    });
  });
});
