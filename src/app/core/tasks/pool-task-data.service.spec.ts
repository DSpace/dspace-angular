import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Store } from '@ngrx/store';

import { getMockRequestService } from '../../shared/mocks/request.service.mock';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service.stub';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { CoreState } from '../core.reducers';
import { PoolTaskDataService } from './pool-task-data.service';
import { HttpOptions } from '../dspace-rest-v2/dspace-rest-v2.service';

describe('PoolTaskDataService', () => {
  let service: PoolTaskDataService;
  let options: HttpOptions;
  const taskEndpoint = 'https://rest.api/task';
  const linkPath = 'pooltasks';
  const requestService = getMockRequestService();
  const halService: any = new HALEndpointServiceStub(taskEndpoint);
  const rdbService = {} as RemoteDataBuildService;
  const notificationsService = {} as NotificationsService;
  const http = {} as HttpClient;
  const comparator = {} as any;
  const objectCache = {
    addPatch: () => {
      /* empty */
    },
    getObjectBySelfLink: () => {
      /* empty */
    }
  } as any;
  const store = {} as Store<CoreState>;

  function initTestService(): PoolTaskDataService {
    return new PoolTaskDataService(
      requestService,
      rdbService,
      store,
      objectCache,
      halService,
      notificationsService,
      http,
      comparator
    );
  }

  beforeEach(() => {
    service = initTestService();
    options = Object.create({});
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
    options.headers = headers;
  });

  describe('claimTask', () => {

    it('should call postToEndpoint method', () => {
      spyOn(service, 'postToEndpoint');
      const scopeId = '1234';
      service.claimTask(scopeId);

      expect(service.postToEndpoint).toHaveBeenCalledWith(linkPath, {}, scopeId, options);
    });
  });
});
