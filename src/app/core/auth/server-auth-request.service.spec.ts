import { AuthRequestService } from './auth-request.service';
import { RequestService } from '../data/request.service';
import { ServerAuthRequestService } from './server-auth-request.service';
import { HttpXsrfTokenExtractorMock } from '../../shared/mocks/http-xsrf-token-extractor.mock';

describe(`ServerAuthRequestService`, () => {
  let href: string;
  let requestService: RequestService;
  let service: AuthRequestService;
  let xsrfExtractor: HttpXsrfTokenExtractorMock;

  const mockToken = 'mockToken';

  beforeEach(() => {
    href = 'https://rest.api/auth/shortlivedtokens';
    requestService = jasmine.createSpyObj('requestService', {
      'generateRequestId': '8bb0582d-5013-4337-af9c-763beb25aae2'
    });
    xsrfExtractor = new  HttpXsrfTokenExtractorMock(mockToken);
    service = new ServerAuthRequestService(null, requestService, null, xsrfExtractor);
  });

  describe(`createShortLivedTokenRequest`, () => {
    it(`should return a PostRequest`, () => {
      const result = (service as any).createShortLivedTokenRequest(href);
      expect(result.constructor.name).toBe('PostRequest');
    });

    it(`should return a request with the given href`, () => {
      const result = (service as any).createShortLivedTokenRequest(href);
      expect(result.href).toBe(href) ;
    });

    it(`should return a request with a xsrf header`, () => {
      const result = (service as any).createShortLivedTokenRequest(href);
      expect(result.options.headers.get('X-XSRF-TOKEN')).toBe(mockToken);
    });

    it(`should have a responseMsToLive of 2 seconds`, () => {
      const result = (service as any).createShortLivedTokenRequest(href);
      expect(result.responseMsToLive).toBe(2 * 1000) ;
    });
  });
});
