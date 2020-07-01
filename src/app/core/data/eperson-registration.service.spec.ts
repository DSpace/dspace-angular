import { RequestService } from './request.service';
import { EpersonRegistrationService } from './eperson-registration.service';
import { RegistrationSuccessResponse, RestResponse } from '../cache/response.models';
import { RequestEntry } from './request.reducer';
import { cold } from 'jasmine-marbles';
import { PostRequest } from './request.models';
import { Registration } from '../shared/registration.model';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service.stub';

describe('EpersonRegistrationService', () => {
  let service: EpersonRegistrationService;
  let requestService: RequestService;

  let halService: any;

  const registration = new Registration();
  registration.email = 'test@mail.org';

  const registrationWithUser = new Registration();
  registrationWithUser.email = 'test@mail.org';
  registrationWithUser.user = 'test-uuid';

  beforeEach(() => {
    halService = new HALEndpointServiceStub('rest-url');

    requestService = jasmine.createSpyObj('requestService', {
      generateRequestId: 'request-id',
      configure: {},
      getByUUID: cold('a',
        {a: Object.assign(new RequestEntry(), {response: new RestResponse(true, 200, 'Success')})})
    });
    service = new EpersonRegistrationService(
      requestService,
      halService
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

      expect(requestService.configure).toHaveBeenCalledWith(new PostRequest('request-id', 'rest-url/registrations', registration));
      expect(expected).toBeObservable(cold('a', {a: new RestResponse(true, 200, 'Success')}));
    });
  });

  describe('searchByToken', () => {
    beforeEach(() => {
      (requestService.getByUUID as jasmine.Spy).and.returnValue(
        cold('a',
          {a: Object.assign(new RequestEntry(), {response: new RegistrationSuccessResponse(registrationWithUser, 200, 'Success')})})
      );
    });
    it('should return a registration corresponding to the provided token', () => {
      const expected = service.searchByToken('test-token');

      expect(expected).toBeObservable(cold('(a|)', {
        a: Object.assign(new Registration(), {
          email: registrationWithUser.email,
          token: 'test-token',
          user: registrationWithUser.user
        })
      }));

    });
  });

});
