import { BrowseDefinitionDataService } from './browse-definition-data.service';
import { FindListOptions } from '../data/request.models';
import { followLink } from '../../shared/utils/follow-link-config.model';
import { EMPTY } from 'rxjs';

describe(`BrowseDefinitionDataService`, () => {
  let service: BrowseDefinitionDataService;
  const dataServiceImplSpy = jasmine.createSpyObj('dataService', {
    findAll: EMPTY,
    findByHref: EMPTY,
    findAllByHref: EMPTY,
  });
  const hrefAll = 'https://rest.api/server/api/discover/browses';
  const hrefSingle = 'https://rest.api/server/api/discover/browses/author';
  const options = new FindListOptions();
  const linksToFollow = [
    followLink('entries'),
    followLink('items')
  ];

  beforeEach(() => {
    service = new BrowseDefinitionDataService(null, null, null, null, null, null, null, null);
    (service as any).dataService = dataServiceImplSpy;
  });

  describe(`findAll`, () => {
    it(`should call findAll on DataServiceImpl`, () => {
      service.findAll(options, true, false, ...linksToFollow);
      expect(dataServiceImplSpy.findAll).toHaveBeenCalledWith(options, true, false, ...linksToFollow);
    });
  });

  describe(`findByHref`, () => {
    it(`should call findByHref on DataServiceImpl`, () => {
      service.findByHref(hrefSingle, true, false, ...linksToFollow);
      expect(dataServiceImplSpy.findByHref).toHaveBeenCalledWith(hrefSingle, true, false, ...linksToFollow);
    });
  });

  describe(`findAllByHref`, () => {
    it(`should call findAllByHref on DataServiceImpl`, () => {
      service.findAllByHref(hrefAll, options, true, false, ...linksToFollow);
      expect(dataServiceImplSpy.findAllByHref).toHaveBeenCalledWith(hrefAll, options, true, false, ...linksToFollow);
    });
  });

});
