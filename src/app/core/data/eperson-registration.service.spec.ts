import { RequestService } from './request.service';
import { EpersonRegistrationService } from './eperson-registration.service';
import { RestResponse } from '../cache/response.models';
import { RequestEntry, RequestEntryState } from './request.reducer';
import { cold } from 'jasmine-marbles';
import { PostRequest } from './request.models';
import { Registration } from '../shared/registration.model';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service.stub';
import { createPendingRemoteDataObject, createSuccessfulRemoteDataObject } from '../../shared/remote-data.utils';
import { of as observableOf } from 'rxjs/internal/observable/of';
import { TestScheduler } from 'rxjs/testing';

fdescribe('EpersonRegistrationService', () => {
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
        { a: Object.assign(new RequestEntry(), { response: new RestResponse(true, 200, 'Success') }) })
    });
    rdbService = jasmine.createSpyObj('rdbService', {
      buildSingle: observableOf(rd),
      buildFromRequestUUID: observableOf(rd),
    });
    service = new EpersonRegistrationService(
      requestService,
      rdbService,
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

      expect(requestService.send).toHaveBeenCalledWith(new PostRequest('request-id', 'rest-url/registrations', registration));
      expect(expected).toBeObservable(cold('(a|)', { a: rd }));
    });
  });

  describe('searchByToken', () => {
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

    it('should return the original registration if it was already cached', () => {
      testScheduler.run(({ cold, expectObservable }) => {
        rdbService.buildSingle.and.returnValue(cold('a-b-c', {
          a: createSuccessfulRemoteDataObject(registrationWithUser),
          b: createPendingRemoteDataObject(),
          c: createSuccessfulRemoteDataObject(new Registration())
        }));

        expectObservable(
          service.searchByToken('test-token')
        ).toBe('(a|)', {
          a: Object.assign(new Registration(), {
            email: registrationWithUser.email,
            token: 'test-token',
            user: registrationWithUser.user
          })
        });
      });
    });

    it('should re-request the registration if it was already cached but stale', () => {
      const rdCachedStale = createSuccessfulRemoteDataObject(new Registration());
      rdCachedStale.state = RequestEntryState.SuccessStale;

      testScheduler.run(({ cold, expectObservable }) => {
        rdbService.buildSingle.and.returnValue(cold('a-b-c', {
          a: rdCachedStale,
          b: createPendingRemoteDataObject(),
          c: createSuccessfulRemoteDataObject(registrationWithUser),
        }));

        expectObservable(
          service.searchByToken('test-token')
        ).toBe('----(c|)', {
         c: Object.assign(new Registration(), {
           email: registrationWithUser.email,
           token: 'test-token',
           user: registrationWithUser.user
         })
        });
      });
    });
  });

});
