import { Metric } from '../shared/metric.model';
import { MetricsComponentsDataService } from './metrics-components-data.service';
import { MetricsComponent } from './models/metrics-component.model';
import { TestScheduler } from 'rxjs/testing';
import { RequestService } from '../data/request.service';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { RequestEntry } from '../data/request.reducer';
import { createSuccessfulRemoteDataObject } from '../../shared/remote-data.utils';
import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import { RestResponse } from '../cache/response.models';
import { of } from 'rxjs';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { HttpClient } from '@angular/common/http';
import { METRICSCOMPONENT } from './models/metrics-component.resource-type';

describe('MetricsComponentsDataService', () => {

  let scheduler: TestScheduler;
  let service: MetricsComponentsDataService;
  let requestService: RequestService;
  let rdbService: RemoteDataBuildService;
  let objectCache: ObjectCacheService;
  let halService: HALEndpointService;
  let responseCacheEntry: RequestEntry;

  const metricsComponent: MetricsComponent = {
    id: 'box-shortname-1',
    type: METRICSCOMPONENT,
    metrics: [],
    _links: {
      self: {
        href: 'https://rest.api/rest/api/metricscomponent/box-shortname-1'
      }
    }
  };

  const endpointURL = `https://rest.api/rest/api/metricscomponent`;
  const metricsComponentRD = createSuccessfulRemoteDataObject(metricsComponent);
  const requestUUID = '8b3c613a-5a4b-438b-9686-be1d5b4a1c5a';
  const metricsComponentID = 1;

  beforeEach(() => {
    scheduler = getTestScheduler();
    halService = jasmine.createSpyObj('halService', {
      getEndpoint: cold('a', { a: endpointURL })
    });
    responseCacheEntry = new RequestEntry();
    responseCacheEntry.response = new RestResponse(true, 200, 'Success');

    requestService = jasmine.createSpyObj('requestService', {
      generateRequestId: requestUUID,
      configure: true,
      removeByHrefSubstring: {},
      getByHref: of(responseCacheEntry),
      getByUUID: of(responseCacheEntry),
    });

    rdbService = jasmine.createSpyObj('rdbService', {
      buildSingle: hot('a|', {
        a: metricsComponentRD
      })
    });

    objectCache = {} as ObjectCacheService;
    const notificationsService = {} as NotificationsService;
    const http = {} as HttpClient;
    const comparator = {} as any;

    service = new MetricsComponentsDataService(
      requestService,
      rdbService,
      objectCache,
      halService,
      notificationsService,
      http,
      comparator
    );

    spyOn((service as any).dataService, 'findById').and.callThrough();
  });

  describe('findById', () => {
    it('should proxy the call to dataservice.findById', () => {
      scheduler.schedule(() => service.findById(metricsComponentID));
      scheduler.flush();

      expect((service as any).dataService.findById).toHaveBeenCalledWith(metricsComponentID.toString());
    });

    it('should return a RemoteData<MetricsComponent> for the object with the given id', () => {
      const result = service.findById(metricsComponentID);
      const expected = cold('a|', {
        a: metricsComponentRD
      });
      expect(result).toBeObservable(expected);
    });
  });

  describe('computeMetricsRows', () => {

    it('should filter metrics out of the box scope', () => {

      const metrics: Metric[] = []
      const metricTypes: string[] = [];

      metrics.push({...metricMock, metricType: 'views'});
      metrics.push({...metricMock, metricType: 'downloads'});
      metricTypes.push('views');

      const result = service.computeMetricsRows(metrics, 1, metricTypes);

      expect(result.length).toBe(1);
      expect(result[0].metrics.length).toBe(1);
      expect(result[0].metrics[0].metricType).toBe('views');

    });

    it('should order metrics based on metricType.position', () => {

      const metrics: Metric[] = []
      const metricTypes: string[] = [];

      metrics.push({...metricMock, metricType: 'views'});
      metrics.push({...metricMock, metricType: 'downloads'});

      metricTypes.push('downloads');
      metricTypes.push('views');

      const result = service.computeMetricsRows(metrics, 2, metricTypes);

      expect(result.length).toBe(1);
      expect(result[0].metrics.length).toBe(2);
      expect(result[0].metrics[0].metricType).toBe('views');
      expect(result[0].metrics[1].metricType).toBe('downloads');

    });

    it('should split rows based on maxColumn', () => {

      const metrics: Metric[] = []
      const metricTypes: string[] = [];

      metrics.push({...metricMock, metricType: 'views'});
      metrics.push({...metricMock, metricType: 'views'});
      metrics.push({...metricMock, metricType: 'views'});
      metrics.push({...metricMock, metricType: 'views'});
      metrics.push({...metricMock, metricType: 'views'});

      metricTypes.push('views');

      const result = service.computeMetricsRows(metrics, 2, metricTypes);

      expect(result.length).toBe(3);

    });

    it('should fill the last row with null values to reach maxColumn', () => {

      const metrics: Metric[] = []
      const metricTypes: string[] = [];

      metrics.push({...metricMock, metricType: 'views'});

      metricTypes.push('views');

      const result = service.computeMetricsRows(metrics, 3, metricTypes);

      expect(result.length).toBe(1);
      expect(result[0].metrics.length).toBe(3);
      expect(result[0].metrics[0]).toBeTruthy();
      expect(result[0].metrics[1]).toBeNull();
      expect(result[0].metrics[2]).toBeNull();

    });

  });

});

const metricMock = {
  acquisitionDate: new Date(),
  deltaPeriod1: null,
  deltaPeriod2: null,
  endDate: null,
  id: '1',
  last: true,
  metricCount: 333,
  metricType: 'views',
  rank: null,
  remark: null,
  startDate: null,
  type: null,
  _links: null
}
