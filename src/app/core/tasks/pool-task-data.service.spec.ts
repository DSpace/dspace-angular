import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Store } from '@ngrx/store';

import { getMockRequestService } from '../../shared/mocks/request.service.mock';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service.stub';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { CoreState } from '../core.reducers';
import { PoolTaskDataService } from './pool-task-data.service';
import { getTestScheduler } from 'jasmine-marbles';
import { TestScheduler } from 'rxjs/testing';
import { of as observableOf } from 'rxjs/internal/observable/of';
import { FindListOptions } from '../data/request.models';
import { RequestParam } from '../cache/models/request-param.model';
import { HttpOptions } from '../dspace-rest/dspace-rest.service';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';

describe('PoolTaskDataService', () => {
  let scheduler: TestScheduler;
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
    scheduler = getTestScheduler();
    service = initTestService();
    options = Object.create({});
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
    options.headers = headers;
  });

  describe('findByItem', () => {

    it('should call searchTask method', () => {
      spyOn((service as any), 'searchTask').and.returnValue(observableOf(createSuccessfulRemoteDataObject$({})));

      scheduler.schedule(() => service.findByItem('a0db0fde-1d12-4d43-bd0d-0f43df8d823c').subscribe());
      scheduler.flush();

      const findListOptions = new FindListOptions();
      findListOptions.searchParams = [
        new RequestParam('uuid', 'a0db0fde-1d12-4d43-bd0d-0f43df8d823c')
      ];

      expect(service.searchTask).toHaveBeenCalledWith('findByItem', findListOptions);
    });
  });

  describe('getPoolTaskEndpointById', () => {

    it('should call getEndpointById method', () => {
      spyOn(service, 'getEndpointById').and.returnValue(observableOf(null));

      scheduler.schedule(() => service.getPoolTaskEndpointById('a0db0fde-1d12-4d43-bd0d-0f43df8d823c').subscribe());
      scheduler.flush();

      expect(service.getEndpointById).toHaveBeenCalledWith('a0db0fde-1d12-4d43-bd0d-0f43df8d823c');

    });
  });
});
