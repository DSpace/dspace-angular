import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Store } from '@ngrx/store';

import { getMockRequestService } from '../../shared/mocks/mock-request.service';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service-stub';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { CoreState } from '../core.reducers';
import { ClaimedTaskDataService } from './claimed-task-data.service';
import { HttpOptions } from '../dspace-rest-v2/dspace-rest-v2.service';

describe('ClaimedTaskDataService', () => {
  let service: ClaimedTaskDataService;
  let options: HttpOptions;
  const taskEndpoint = 'https://rest.api/task';
  const linkPath = 'claimedtasks';
  const requestService: any = getMockRequestService();
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

  function initTestService(): ClaimedTaskDataService {
    return new ClaimedTaskDataService(
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

  describe('approveTask', () => {

    it('should call postToEndpoint method', () => {
      const scopeId = '1234';
      const body = {
        submit_approve: 'true'
      };

      spyOn(service, 'postToEndpoint');
      requestService.uriEncodeBody.and.returnValue(body);

      service.approveTask(scopeId);

      expect(service.postToEndpoint).toHaveBeenCalledWith(linkPath, body, scopeId, options);
    });
  });

  describe('rejectTask', () => {

    it('should call postToEndpoint method', () => {
      const scopeId = '1234';
      const reason = 'test reject';
      const body = {
        submit_reject: 'true',
        reason
      };

      spyOn(service, 'postToEndpoint');
      requestService.uriEncodeBody.and.returnValue(body);

      service.rejectTask(reason, scopeId);

      expect(service.postToEndpoint).toHaveBeenCalledWith(linkPath, body, scopeId, options);
    });
  });

  describe('returnToPoolTask', () => {

    it('should call deleteById method', () => {
      const scopeId = '1234';

      spyOn(service, 'deleteById');

      service.returnToPoolTask(scopeId);

      expect(service.deleteById).toHaveBeenCalledWith(linkPath, scopeId, options);
    });
  });
});
