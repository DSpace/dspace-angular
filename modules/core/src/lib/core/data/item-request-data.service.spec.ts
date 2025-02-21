import { of as observableOf } from 'rxjs';

import { RemoteDataBuildService } from '../cache';
import { RequestCopyEmail } from '../request-copy';
import { HALEndpointService } from '../shared';
import { ItemRequest } from '../shared';
import { createSuccessfulRemoteDataObject$ } from '../utilities';
import { ItemRequestDataService } from './item-request-data.service';
import { PostRequest } from './request.models';
import { RequestService } from './request.service';
import { RestRequestMethod } from './rest-request-method';

describe('ItemRequestDataService', () => {
  let service: ItemRequestDataService;

  let requestService: RequestService;
  let rdbService: RemoteDataBuildService;
  let halService: HALEndpointService;

  const restApiEndpoint = 'rest/api/endpoint/';
  const requestId = 'request-id';
  let itemRequest: ItemRequest;

  beforeEach(() => {
    itemRequest = Object.assign(new ItemRequest(), {
      token: 'item-request-token',
    });
    requestService = jasmine.createSpyObj('requestService', {
      generateRequestId: requestId,
      send: '',
    });
    rdbService = jasmine.createSpyObj('rdbService', {
      buildFromRequestUUID: createSuccessfulRemoteDataObject$(itemRequest),
    });
    halService = jasmine.createSpyObj('halService', {
      getEndpoint: observableOf(restApiEndpoint),
    });

    service = new ItemRequestDataService(requestService, rdbService, null, halService);
  });

  describe('requestACopy', () => {
    it('should send a POST request containing the provided item request', (done) => {
      service.requestACopy(itemRequest).subscribe(() => {
        expect(requestService.send).toHaveBeenCalledWith(new PostRequest(requestId, restApiEndpoint, itemRequest));
        done();
      });
    });
  });

  describe('grant', () => {
    let email: RequestCopyEmail;

    beforeEach(() => {
      email = new RequestCopyEmail('subject', 'message');
    });

    it('should send a PUT request containing the correct properties', (done) => {
      service.grant(itemRequest.token, email, true).subscribe(() => {
        expect(requestService.send).toHaveBeenCalledWith(jasmine.objectContaining({
          method: RestRequestMethod.PUT,
          body: JSON.stringify({
            acceptRequest: true,
            responseMessage: email.message,
            subject: email.subject,
            suggestOpenAccess: true,
          }),
        }));
        done();
      });
    });
  });

  describe('deny', () => {
    let email: RequestCopyEmail;

    beforeEach(() => {
      email = new RequestCopyEmail('subject', 'message');
    });

    it('should send a PUT request containing the correct properties', (done) => {
      service.deny(itemRequest.token, email).subscribe(() => {
        expect(requestService.send).toHaveBeenCalledWith(jasmine.objectContaining({
          method: RestRequestMethod.PUT,
          body: JSON.stringify({
            acceptRequest: false,
            responseMessage: email.message,
            subject: email.subject,
            suggestOpenAccess: false,
          }),
        }));
        done();
      });
    });
  });
});
