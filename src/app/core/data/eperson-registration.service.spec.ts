import { HttpHeaders } from '@angular/common/http';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { createSuccessfulRemoteDataObject } from '../../shared/remote-data.utils';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service.stub';
import { RestResponse } from '../cache/response.models';
import { HttpOptions } from '../dspace-rest/dspace-rest.service';
import { Registration } from '../shared/registration.model';
import { EpersonRegistrationService } from './eperson-registration.service';
import { PostRequest } from './request.models';
import { RequestService } from './request.service';
import { RequestEntry } from './request-entry.model';

describe('EpersonRegistrationService', () => {
  let testScheduler;

  let service: EpersonRegistrationService;
  let requestService: RequestService;

  let halService: any;
  let rdbService: any;

  const registration = new Registration();
  registration.email = 'test@mail.org';

  const registrationWithUser = new Registration();
  registrationWithUser.email = 'test@mail.org';
  registrationWithUser.user = 'test-uuid';

  let rd;

  beforeEach(() => {
    rd = createSuccessfulRemoteDataObject(registrationWithUser);
    halService = new HALEndpointServiceStub('rest-url');

    testScheduler = new TestScheduler((actual, expected) => {
      // asserting the two objects are equal
      // e.g. using chai.
      expect(actual).toEqual(expected);
    });

    requestService = jasmine.createSpyObj('requestService', {
      generateRequestId: 'request-id',
      send: {},
      getByUUID: cold('a',
        { a: Object.assign(new RequestEntry(), { response: new RestResponse(true, 200, 'Success') }) }),
    });
    rdbService = jasmine.createSpyObj('rdbService', {
      buildSingle: of(rd),
      buildFromRequestUUID: of(rd),
    });
    service = new EpersonRegistrationService(
      requestService,
      rdbService,
      halService,
    );
  });

  describe('getRegistrationEndpoint', () => {
    it('should retrieve the registration endpoint', () => {
      const expected = service.getRegistrationEndpoint();

      expected.subscribe(((value) => {
        expect(value).toEqual('rest-url/registrations');
      }));
    });
  });

  describe('getTokenSearchEndpoint', () => {
    it('should return the token search endpoint for a specified token', () => {
      const expected = service.getTokenSearchEndpoint('test-token');

      expected.subscribe(((value) => {
        expect(value).toEqual('rest-url/registrations/search/findByToken?token=test-token');
      }));
    });
  });

  describe('registerEmail', () => {
    it('should send an email registration', () => {

      const expected = service.registerEmail('test@mail.org');
      let headers = new HttpHeaders();
      const options: HttpOptions = Object.create({});
      options.headers = headers;

      expect(requestService.send).toHaveBeenCalledWith(new PostRequest('request-id', 'rest-url/registrations', registration, options));
      expect(expected).toBeObservable(cold('(a|)', { a: rd }));
    });

    it('should send an email registration with captcha', () => {

      const expected = service.registerEmail('test@mail.org', 'afreshcaptchatoken');
      let headers = new HttpHeaders();
      const options: HttpOptions = Object.create({});
      headers = headers.append('x-captcha-payload', 'afreshcaptchatoken');
      options.headers = headers;

      expect(requestService.send).toHaveBeenCalledWith(new PostRequest('request-id', 'rest-url/registrations', registration, options));
      expect(expected).toBeObservable(cold('(a|)', { a: rd }));
    });
  });

  describe('searchByToken', () => {
    it('should return a registration corresponding to the provided token', () => {
      const expected = service.searchByTokenAndUpdateData('test-token');

      expect(expected).toBeObservable(cold('(a|)', {
        a: jasmine.objectContaining({
          payload: Object.assign(new Registration(), {
            email: registrationWithUser.email,
            token: 'test-token',
            user: registrationWithUser.user,
          }),
        }),
      }));
    });

    /* eslint-disable @typescript-eslint/no-shadow */
    it('should use cached responses and /registrations/search/findByToken?', () => {
      testScheduler.run(({ cold, expectObservable }) => {
        rdbService.buildSingle.and.returnValue(cold('a', { a: rd }));

        service.searchByTokenAndUpdateData('test-token');

        expect(requestService.send).toHaveBeenCalledWith(
          jasmine.objectContaining({
            uuid: 'request-id', method: 'GET',
            href: 'rest-url/registrations/search/findByToken?token=test-token',
          }), true,
        );
        expectObservable(rdbService.buildSingle.calls.argsFor(0)[0]).toBe('(a|)', {
          a: 'rest-url/registrations/search/findByToken?token=test-token',
        });
      });
    });

  });

});
/**/
