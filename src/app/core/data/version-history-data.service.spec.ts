import { RequestService } from './request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { VersionHistoryDataService } from './version-history-data.service';
import { NotificationsServiceStub } from '../../shared/testing/notifications-service.stub';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service.stub';
import { getMockRequestService } from '../../shared/mocks/request.service.mock';
import { VersionDataService } from './version-data.service';
import { waitForAsync } from '@angular/core/testing';

const url = 'fake-url';

fdescribe('VersionHistoryDataService', () => {
  let service: VersionHistoryDataService;

  let requestService: RequestService;
  let notificationsService: any;
  let rdbService: RemoteDataBuildService;
  let objectCache: ObjectCacheService;
  let versionService: VersionDataService;
  let halService: any;

  const versionHistoryId = 'version-history-id';

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

  describe('when getVersions is called', () => {
    beforeEach(waitForAsync(() => {
      service.getVersions(versionHistoryId);
    }));
    it('findAllByHref should have been called', () => {
      expect(versionService.findAllByHref).toHaveBeenCalled();
    });
  });

  describe('when getBrowseEndpoint is called', () => {
    it('should return the correct value', () => {
      service.getBrowseEndpoint().subscribe((res) => {
        expect(res).toBe(url + '/versionhistories');
      });
    });
  });

  describe('when getVersionsEndpoint is called', () => {
    it('should return the correct value', () => {
      service.getVersionsEndpoint(versionHistoryId).subscribe((res) => {
        expect(res).toBe(url + '/versions');
      });
    });
  });

  describe('when cache is invalidated', () => {
    it('should call setStaleByHrefSubstring', () => {
      service.invalidateVersionHistoryCache(versionHistoryId);
      expect(requestService.setStaleByHrefSubstring).toHaveBeenCalledWith('versioning/versionhistories/' + versionHistoryId);
    });
  });

});
