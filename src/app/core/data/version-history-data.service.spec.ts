import { RequestService } from './request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { VersionHistoryDataService } from './version-history-data.service';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service.stub';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service.stub';
import { getMockRequestService } from '../../shared/mocks/request.service.mock';
import { VersionDataService } from './version-data.service';

const url = 'fake-url';

describe('VersionHistoryDataService', () => {
  let service: VersionHistoryDataService;

  let requestService: RequestService;
  let notificationsService: any;
  let rdbService: RemoteDataBuildService;
  let objectCache: ObjectCacheService;
  let versionService: VersionDataService;
  let halService: any;

  beforeEach(() => {
    createService();
  });

  describe('getVersions', () => {
    let result;

    beforeEach(() => {
      result = service.getVersions('1');
    });

    it('should call versionService.findAllByHref', () => {
      expect(versionService.findAllByHref).toHaveBeenCalled();
    });
  });

  /**
   * Create a VersionHistoryDataService used for testing
   * @param requestEntry$   Supply a requestEntry to be returned by the REST API (optional)
   */
  function createService(requestEntry$?) {
    requestService = getMockRequestService(requestEntry$);
    rdbService = jasmine.createSpyObj('rdbService', {
      buildList: jasmine.createSpy('buildList')
    });
    objectCache = jasmine.createSpyObj('objectCache', {
      remove: jasmine.createSpy('remove')
    });
    versionService = jasmine.createSpyObj('objectCache', {
      findAllByHref: jasmine.createSpy('findAllByHref')
    });
    halService = new HALEndpointServiceStub(url);
    notificationsService = new NotificationsServiceStub();

    service = new VersionHistoryDataService(requestService, rdbService, null, objectCache, halService, notificationsService, versionService, null, null);
  }
});
