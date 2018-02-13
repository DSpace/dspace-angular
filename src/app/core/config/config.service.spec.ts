import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import { TestScheduler } from 'rxjs/Rx';
import { GlobalConfig } from '../../../config';
import { getMockRequestService } from '../../shared/mocks/mock-request.service';
import { ResponseCacheService } from '../cache/response-cache.service';
import { ConfigService } from './config.service';
import { RequestService } from '../data/request.service';
import { ConfigRequest, FindAllOptions } from '../data/request.models';

const LINK_NAME = 'test';
const BROWSE = 'search/findByCollection';

class TestService extends ConfigService {
  protected linkPath = LINK_NAME;
  protected browseEndpoint = BROWSE;

  constructor(
    protected responseCache: ResponseCacheService,
    protected requestService: RequestService,
    protected EnvConfig: GlobalConfig
  ) {
    super();
  }
}

describe('ConfigService', () => {
  let scheduler: TestScheduler;
  let service: TestService;
  let responseCache: ResponseCacheService;
  let requestService: RequestService;

  const envConfig = {} as GlobalConfig;
  const findOptions: FindAllOptions = new FindAllOptions();

  const scopeName = 'traditional';
  const scopeID = 'd9d30c0c-69b7-4369-8397-ca67c888974d';
  const configEndpoint = 'https://rest.api/config';
  const serviceEndpoint = `${configEndpoint}/${LINK_NAME}`;
  const scopedEndpoint = `${serviceEndpoint}/${scopeName}`;
  const searchEndpoint = `${serviceEndpoint}/${BROWSE}?uuid=${scopeID}`;

  function initMockResponseCacheService(isSuccessful: boolean): ResponseCacheService {
    return jasmine.createSpyObj('responseCache', {
      get: cold('c-', {
        c: { response: { isSuccessful } }
      })
    });
  }

  function initTestService(): TestService {
    return new TestService(
      responseCache,
      requestService,
      envConfig
    );
  }

  beforeEach(() => {
    responseCache = initMockResponseCacheService(true);
    requestService = getMockRequestService();
    service = initTestService();
    scheduler = getTestScheduler();
    spyOn(service, 'getEndpoint').and
      .returnValue(hot('--a-', { a: serviceEndpoint }));
  });

  describe('getConfigByHref', () => {

    it('should configure a new ConfigRequest', () => {
      const expected = new ConfigRequest(requestService.generateRequestId(), scopedEndpoint);
      scheduler.schedule(() => service.getConfigByHref(scopedEndpoint).subscribe());
      scheduler.flush();

      expect(requestService.configure).toHaveBeenCalledWith(expected);
    });
  });

  describe('getConfigByName', () => {

    it('should configure a new ConfigRequest', () => {
      const expected = new ConfigRequest(requestService.generateRequestId(), scopedEndpoint);
      scheduler.schedule(() => service.getConfigByName(scopeName).subscribe());
      scheduler.flush();

      expect(requestService.configure).toHaveBeenCalledWith(expected);
    });
  });

  describe('getConfigBySearch', () => {

    it('should configure a new ConfigRequest', () => {
      findOptions.scopeID = scopeID;
      const expected = new ConfigRequest(requestService.generateRequestId(), searchEndpoint);
      scheduler.schedule(() => service.getConfigBySearch(findOptions).subscribe());
      scheduler.flush();

      expect(requestService.configure).toHaveBeenCalledWith(expected);
    });
  });
});
