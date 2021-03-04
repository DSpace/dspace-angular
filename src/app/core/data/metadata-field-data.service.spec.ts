import { RequestService } from './request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { of as observableOf } from 'rxjs';
import { RestResponse } from '../cache/response.models';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service.stub';
import { FindListOptions } from './request.models';
import { MetadataFieldDataService } from './metadata-field-data.service';
import { MetadataSchema } from '../metadata/metadata-schema.model';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { RequestParam } from '../cache/models/request-param.model';

describe('MetadataFieldDataService', () => {
  let metadataFieldService: MetadataFieldDataService;
  let requestService: RequestService;
  let halService: HALEndpointService;
  let notificationsService: NotificationsService;
  let schema: MetadataSchema;
  let rdbService: RemoteDataBuildService;

  const endpoint = 'api/metadatafield/endpoint';

  function init() {
    schema = Object.assign(new MetadataSchema(), {
      prefix: 'dc',
      namespace: 'namespace',
      _links: {
        self: { href: 'selflink' }
      }
    });
    requestService = jasmine.createSpyObj('requestService', {
      generateRequestId: '34cfed7c-f597-49ef-9cbe-ea351f0023c2',
      send: {},
      getByUUID: observableOf({ response: new RestResponse(true, 200, 'OK') }),
      setStaleByHrefSubstring: {}
    });
    halService = Object.assign(new HALEndpointServiceStub(endpoint));
    notificationsService = jasmine.createSpyObj('notificationsService', {
      error: {}
    });
    rdbService = jasmine.createSpyObj('rdbService', {
      buildSingle: createSuccessfulRemoteDataObject$(undefined)
    });
    metadataFieldService = new MetadataFieldDataService(requestService, rdbService, undefined, halService, undefined, undefined, undefined, notificationsService);
  }

  beforeEach(() => {
    init();
  });

  describe('findBySchema', () => {
    beforeEach(() => {
      spyOn(metadataFieldService, 'searchBy');
    });

    it('should call searchBy with the correct arguments', () => {
      metadataFieldService.findBySchema(schema);
      const expectedOptions = Object.assign(new FindListOptions(), {
        searchParams: [new RequestParam('schema', schema.prefix)]
      });
      expect(metadataFieldService.searchBy).toHaveBeenCalledWith('bySchema', expectedOptions, true, true);
    });
  });

  describe('clearRequests', () => {
    it('should remove requests on the data service\'s endpoint', () => {
      spyOn(metadataFieldService, 'getBrowseEndpoint').and.returnValue(observableOf(endpoint));
      metadataFieldService.clearRequests();
      expect(requestService.setStaleByHrefSubstring).toHaveBeenCalledWith(endpoint);
    });
  });
});
