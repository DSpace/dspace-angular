import { of as observableOf } from 'rxjs';

import { RemoteDataBuildService } from '../cache';
import { RequestCopyEmail } from '@dspace/core';
import { HALEndpointService } from '../shared';
import { ItemRequest } from '../shared';
import { createSuccessfulRemoteDataObject$ } from '../utilities';
import { ItemRequestDataService } from '@dspace/core';
import { PostRequest } from '@dspace/core';
import { RequestService } from '@dspace/core';
import { RestRequestMethod } from '@dspace/core';

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
