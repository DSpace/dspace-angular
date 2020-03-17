import { TestScheduler } from 'rxjs/testing';
import { getTestScheduler } from 'jasmine-marbles';

import { SubmissionRestService } from './submission-rest.service';
import { RequestService } from '../data/request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { getMockRequestService } from '../../shared/mocks/mock-request.service';
import { getMockRemoteDataBuildService } from '../../shared/mocks/mock-remote-data-build.service';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service-stub';
import {
  SubmissionDeleteRequest,
  SubmissionPatchRequest,
  SubmissionPostRequest,
  SubmissionRequest
} from '../data/request.models';
import { FormFieldMetadataValueObject } from '../../shared/form/builder/models/form-field-metadata-value.model';

describe('SubmissionRestService test suite', () => {
  let scheduler: TestScheduler;
  let service: SubmissionRestService;
  let requestService: RequestService;
  let rdbService: RemoteDataBuildService;
  let halService: any;

  const resourceEndpointURL = 'https://rest.api/endpoint';
  const resourceEndpoint = 'workspaceitems';
  const resourceScope = '260';
  const body = { test: new FormFieldMetadataValueObject('test')};
  const resourceHrefWithProjection = resourceEndpointURL + '/' + resourceEndpoint + '/' + resourceScope + '?projection=full';
  const resourceHrefWithoutProjection = resourceEndpointURL + '/' + resourceEndpoint + '/' + resourceScope;
  const timestampResponse = 1545994811992;

  function initTestService() {
    return new SubmissionRestService(
      rdbService,
      requestService,
      halService
    );
  }

  beforeEach(() => {
    requestService = getMockRequestService();
    rdbService = getMockRemoteDataBuildService();
    scheduler = getTestScheduler();
    halService = new HALEndpointServiceStub(resourceEndpointURL);
    service = initTestService();

  });

  describe('deleteById', () => {
    it('should configure a new SubmissionDeleteRequest with projection', () => {
      const expected = new SubmissionDeleteRequest(requestService.generateRequestId(), resourceHrefWithProjection);
      scheduler.schedule(() => service.deleteById(resourceScope, resourceEndpoint, true).subscribe());
      scheduler.flush();

      expect(requestService.configure).toHaveBeenCalledWith(expected);
    });

    it('should configure a new SubmissionDeleteRequest without projection', () => {
      const expected = new SubmissionDeleteRequest(requestService.generateRequestId(), resourceHrefWithoutProjection);
      scheduler.schedule(() => service.deleteById(resourceScope, resourceEndpoint).subscribe());
      scheduler.flush();

      expect(requestService.configure).toHaveBeenCalledWith(expected);
    });
  });

  describe('getDataById', () => {
    it('should configure a new SubmissionRequest with projection', () => {
      const expected = new SubmissionRequest(requestService.generateRequestId(), resourceHrefWithProjection);
      expected.forceBypassCache = true;
      scheduler.schedule(() => service.getDataById(resourceEndpoint, resourceScope).subscribe());
      scheduler.flush();

      expect(requestService.removeByHrefSubstring).toHaveBeenCalledWith(resourceHrefWithProjection);
      expect(requestService.configure).toHaveBeenCalledWith(expected);
    });

    it('should configure a new SubmissionRequest without projection', () => {
      const expected = new SubmissionRequest(requestService.generateRequestId(), resourceHrefWithoutProjection);
      expected.forceBypassCache = true;
      scheduler.schedule(() => service.getDataById(resourceEndpoint, resourceScope, false).subscribe());
      scheduler.flush();

      expect(requestService.removeByHrefSubstring).toHaveBeenCalledWith(resourceHrefWithoutProjection);
      expect(requestService.configure).toHaveBeenCalledWith(expected);
    });
  });

  describe('postToEndpoint', () => {
    it('should configure a new SubmissionPostRequest with projection', () => {
      const expected = new SubmissionPostRequest(requestService.generateRequestId(), resourceHrefWithProjection, body, null);
      scheduler.schedule(() => service.postToEndpoint(
        resourceEndpoint,
        body,
        resourceScope,
        null,
        null,
        true
      ).subscribe());
      scheduler.flush();

      expect(requestService.configure).toHaveBeenCalledWith(expected);
    });

    it('should configure a new SubmissionPostRequest without projection', () => {
      const expected = new SubmissionPostRequest(requestService.generateRequestId(), resourceHrefWithoutProjection, body, null);
      scheduler.schedule(() => service.postToEndpoint(
        resourceEndpoint,
        body,
        resourceScope,
        null,
        null,
        false
      ).subscribe());
      scheduler.flush();

      expect(requestService.configure).toHaveBeenCalledWith(expected);
    });
  });

  describe('patchToEndpoint', () => {
    it('should configure a new SubmissionPatchRequest with projection', () => {
      const expected = new SubmissionPatchRequest(requestService.generateRequestId(), resourceHrefWithProjection, body);
      scheduler.schedule(() => service.patchToEndpoint(resourceEndpoint, body, resourceScope).subscribe());
      scheduler.flush();

      expect(requestService.configure).toHaveBeenCalledWith(expected);
    });

    it('should configure a new SubmissionPatchRequest without projection', () => {
      const expected = new SubmissionPatchRequest(requestService.generateRequestId(), resourceHrefWithoutProjection, body);
      scheduler.schedule(() => service.patchToEndpoint(resourceEndpoint, body, resourceScope, false).subscribe());
      scheduler.flush();

      expect(requestService.configure).toHaveBeenCalledWith(expected);
    });
  });
});
