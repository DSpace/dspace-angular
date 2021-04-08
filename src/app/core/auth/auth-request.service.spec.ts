import { AuthRequestService } from './auth-request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RequestService } from '../data/request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { PostRequest } from '../data/request.models';
import { TestScheduler } from 'rxjs/testing';
import { createSuccessfulRemoteDataObject } from '../../shared/remote-data.utils';
import { ShortLivedToken } from './models/short-lived-token.model';
import { RemoteData } from '../data/remote-data';

describe(`AuthRequestService`, () => {
  let halService: HALEndpointService;
  let endpointURL: string;
  let shortLivedToken: ShortLivedToken;
  let shortLivedTokenRD: RemoteData<ShortLivedToken>;
  let requestService: RequestService;
  let rdbService: RemoteDataBuildService;
  let service: AuthRequestService;
  let testScheduler;

    class TestAuthRequestService extends AuthRequestService {
      constructor(
        hes: HALEndpointService,
        rs: RequestService,
        rdbs: RemoteDataBuildService
      ) {
        super(hes, rs, rdbs);
      }

      protected createShortLivedTokenRequest(href: string): PostRequest {
        return new PostRequest(this.requestService.generateRequestId(), href);
      }
    }

    const init = (cold: typeof TestScheduler.prototype.createColdObservable) => {
      endpointURL = 'https://rest.api/auth';
      shortLivedToken = Object.assign(new ShortLivedToken(), {
        value: 'some-token'
      });
      shortLivedTokenRD = createSuccessfulRemoteDataObject(shortLivedToken);

      halService = jasmine.createSpyObj('halService', {
        'getEndpoint': cold('a', { a: endpointURL })
      });
      requestService = jasmine.createSpyObj('requestService', {
        'send': null
      });
      rdbService = jasmine.createSpyObj('rdbService', {
        'buildFromRequestUUID': cold('a', { a: shortLivedTokenRD })
      });

      service = new TestAuthRequestService(halService, requestService, rdbService);
    };

    beforeEach(() => {
      testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
      });
    });

  describe(`getShortlivedToken`, () => {
    it(`should call createShortLivedTokenRequest with the url for the endpoint`, () => {
      testScheduler.run(({ cold, expectObservable, flush }) => {
        init(cold);
        spyOn(service as any, 'createShortLivedTokenRequest');
        // expectObservable is needed to let testScheduler know to take it in to account, but since
        // we're not testing the outcome in this test, a .toBe(…) isn't necessary
        expectObservable(service.getShortlivedToken());
        flush();
        expect((service as any).createShortLivedTokenRequest).toHaveBeenCalledWith(`${endpointURL}/shortlivedtokens`);
      });
    });
  });
});
