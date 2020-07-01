import { RequestService } from './request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { of as observableOf } from 'rxjs/internal/observable/of';
import { RestResponse } from '../cache/response.models';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service.stub';
import { CreateRequest, FindListOptions, PutRequest } from './request.models';
import { MetadataFieldDataService } from './metadata-field-data.service';
import { MetadataField } from '../metadata/metadata-field.model';
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
      configure: {},
      getByUUID: observableOf({ response: new RestResponse(true, 200, 'OK') }),
      removeByHrefSubstring: {}
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
      expect(metadataFieldService.searchBy).toHaveBeenCalledWith('bySchema', expectedOptions);
    });
  });

  describe('createOrUpdateMetadataField', () => {
    let field: MetadataField;

    beforeEach(() => {
      field = Object.assign(new MetadataField(), {
        element: 'identifier',
        qualifier: undefined,
        schema: schema,
        _links: {
          self: { href: 'selflink' }
        }
      });
    });

    describe('called with a new metadata field', () => {
      it('should send a CreateRequest', (done) => {
        metadataFieldService.createOrUpdateMetadataField(field).subscribe(() => {
          expect(requestService.configure).toHaveBeenCalledWith(jasmine.any(CreateRequest));
          done();
        });
      });
    });

    describe('called with an existing metadata field', () => {
      beforeEach(() => {
        field = Object.assign(field, {
          id: 'id-of-existing-field'
        });
      });

      it('should send a PutRequest', (done) => {
        metadataFieldService.createOrUpdateMetadataField(field).subscribe(() => {
          expect(requestService.configure).toHaveBeenCalledWith(jasmine.any(PutRequest));
          done();
        });
      });
    });
  });

  describe('clearRequests', () => {
    it('should remove requests on the data service\'s endpoint', (done) => {
      metadataFieldService.clearRequests().subscribe(() => {
        expect(requestService.removeByHrefSubstring).toHaveBeenCalledWith(`${endpoint}/${(metadataFieldService as any).linkPath}`);
        done();
      });
    });
  });
});
