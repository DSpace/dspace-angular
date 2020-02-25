import { getTestScheduler } from 'jasmine-marbles';
import { TestScheduler } from 'rxjs/testing';

import { getMockRequestService } from '../../shared/mocks/mock-request.service';
import { TasksService } from './tasks.service';
import { RequestService } from '../data/request.service';
import { TaskDeleteRequest, TaskPostRequest } from '../data/request.models';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { HALEndpointServiceStub } from '../../shared/testing/hal-endpoint-service-stub';
import { TaskObject } from './models/task-object.model';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { Store } from '@ngrx/store';
import { CoreState } from '../core.reducers';
import { ObjectCacheService } from '../cache/object-cache.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DSOChangeAnalyzer } from '../data/dso-change-analyzer.service';
import { ChangeAnalyzer } from '../data/change-analyzer';
import { compare, Operation } from 'fast-json-patch';
import { HttpOptions } from '../dspace-rest-v2/dspace-rest-v2.service';

const LINK_NAME = 'test';

/* tslint:disable:max-classes-per-file */
class TestTask extends TaskObject {
}

class TestService extends TasksService<TestTask> {
  protected linkPath = LINK_NAME;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DSOChangeAnalyzer<TestTask>) {
    super();
  }
}

class DummyChangeAnalyzer implements ChangeAnalyzer<TestTask> {
  diff(object1: TestTask, object2: TestTask): Operation[] {
    return compare((object1 as any).metadata, (object2 as any).metadata);
  }

}
/* tslint:enable:max-classes-per-file */

describe('TasksService', () => {
  let scheduler: TestScheduler;
  let service: TestService;
  const taskEndpoint = 'https://rest.api/task';
  const linkPath = 'testTask';
  const requestService = getMockRequestService();
  const halService: any = new HALEndpointServiceStub(taskEndpoint);
  const rdbService = {} as RemoteDataBuildService;
  const notificationsService = {} as NotificationsService;
  const http = {} as HttpClient;
  const comparator = new DummyChangeAnalyzer() as any;
  const objectCache = {
    addPatch: () => {
      /* empty */
    },
    getObjectBySelfLink: () => {
      /* empty */
    }
  } as any;
  const store = {} as Store<CoreState>;

  function initTestService(): TestService {
    return new TestService(
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
    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
    options.headers = headers;

  });

  describe('postToEndpoint', () => {

    it('should configure a new TaskPostRequest', () => {
      const expected = new TaskPostRequest(requestService.generateRequestId(), `${taskEndpoint}/${linkPath}`, {});
      scheduler.schedule(() => service.postToEndpoint('testTask', {}).subscribe());
      scheduler.flush();

      expect(requestService.configure).toHaveBeenCalledWith(expected);
    });
  });

  describe('deleteById', () => {

    it('should configure a new TaskDeleteRequest', () => {
      const scopeId = '1234';
      const expected = new TaskDeleteRequest(requestService.generateRequestId(), `${taskEndpoint}/${linkPath}/${scopeId}`, null);
      scheduler.schedule(() => service.deleteById('testTask', scopeId).subscribe());
      scheduler.flush();

      expect(requestService.configure).toHaveBeenCalledWith(expected);
    });
  });

});
