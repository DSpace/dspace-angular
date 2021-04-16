import { AuthRequestService } from './auth-request.service';
import { RequestService } from '../data/request.service';
import { BrowserAuthRequestService } from './browser-auth-request.service';

describe(`BrowserAuthRequestService`, () => {
  let href: string;
  let requestService: RequestService;
  let service: AuthRequestService;

  beforeEach(() => {
    href = 'https://rest.api/auth/shortlivedtokens';
    requestService = jasmine.createSpyObj('requestService', {
      'generateRequestId': '8bb0582d-5013-4337-af9c-763beb25aae2'
    });
    service = new BrowserAuthRequestService(null, requestService, null);
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
  });
});
