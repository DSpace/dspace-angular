import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { APP_CONFIG } from '@dspace/config/app-config.interface';

import { ObjectCacheService } from '../cache/object-cache.service';
import { FLAT_BROWSE_DEFINITION } from '../shared/flat-browse-definition.resource-type';
import { HIERARCHICAL_BROWSE_DEFINITION } from '../shared/hierarchical-browse-definition.resource-type';
import { VALUE_LIST_BROWSE_DEFINITION } from '../shared/value-list-browse-definition.resource-type';
import { getMockObjectCacheService } from '../testing/object-cache.service.mock';
import { BrowseResponseParsingService } from './browse-response-parsing.service';

@Injectable()
class TestService extends BrowseResponseParsingService {
  constructor(protected objectCache: ObjectCacheService) {
    super(objectCache);
  }

  // Overwrite method to make it public for testing
  public deserialize<ObjectDomain>(obj): any {
    return super.deserialize(obj);
  }
}

describe('BrowseResponseParsingService', () => {
  let service: TestService;


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ObjectCacheService, useValue: getMockObjectCacheService() },
        { provide: APP_CONFIG, useValue: { rest: { baseUrl: 'https://rest.com/server' } } },
        TestService,
      ],
    });
    service = TestBed.inject(TestService);
  });

  describe('', () => {
    const mockFlatBrowse = {
      id: 'title',
      browseType: 'flatBrowse',
      type: 'browse',
    };

    const mockValueList = {
      id: 'author',
      browseType: 'valueList',
      type: 'browse',
    };

    const mockHierarchicalBrowse = {
      id: 'srsc',
      browseType: 'hierarchicalBrowse',
      type: 'browse',
    };

    it('should deserialize flatBrowses correctly', () => {
      let deserialized = service.deserialize(mockFlatBrowse);
      expect(deserialized.type).toBe(FLAT_BROWSE_DEFINITION);
      expect(deserialized.id).toBe(mockFlatBrowse.id);
    });

    it('should deserialize valueList browses correctly', () => {
      let deserialized = service.deserialize(mockValueList);
      expect(deserialized.type).toBe(VALUE_LIST_BROWSE_DEFINITION);
      expect(deserialized.id).toBe(mockValueList.id);
    });

    it('should deserialize hierarchicalBrowses correctly', () => {
      let deserialized = service.deserialize(mockHierarchicalBrowse);
      expect(deserialized.type).toBe(HIERARCHICAL_BROWSE_DEFINITION);
      expect(deserialized.id).toBe(mockHierarchicalBrowse.id);
    });
  });
});
