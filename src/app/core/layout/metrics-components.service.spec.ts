import { Metric } from '../shared/metric.model';
import { MetricsComponentsService } from './metrics-components.service';

describe('MetricsComponentsService', () => {

  let service: MetricsComponentsService;

  beforeEach(() => {
    service = new MetricsComponentsService();

  });

  describe('computeMetricsRows', () => {

    it('should filter metrics out of the box scope', () => {

      const metrics: Metric[] = [];
      const metricTypes: string[] = [];

      metrics.push({ ...metricMock, metricType: 'views' });
      metrics.push({ ...metricMock, metricType: 'downloads' });
      metricTypes.push('views');

      const result = service.computeMetricsRows(metrics, 1, metricTypes);

      expect(result.length).toBe(1);
      expect(result[0].metrics.length).toBe(1);
      expect(result[0].metrics[0].metricType).toBe('views');

    });

    it('should order metrics based on metricType.position', () => {

      const metrics: Metric[] = [];
      const metricTypes: string[] = [];

      metrics.push({ ...metricMock, metricType: 'views' });
      metrics.push({ ...metricMock, metricType: 'downloads' });

      metricTypes.push('downloads');
      metricTypes.push('views');

      const result = service.computeMetricsRows(metrics, 2, metricTypes);

      expect(result.length).toBe(1);
      expect(result[0].metrics.length).toBe(2);
      expect(result[0].metrics[0].metricType).toBe('downloads');
      expect(result[0].metrics[1].metricType).toBe('views');

    });

    it('should split rows based on maxColumn', () => {

      const metrics: Metric[] = [];
      const metricTypes: string[] = [];

      metrics.push({ ...metricMock, metricType: 'views' });
      metrics.push({ ...metricMock, metricType: 'views' });
      metrics.push({ ...metricMock, metricType: 'views' });
      metrics.push({ ...metricMock, metricType: 'views' });
      metrics.push({ ...metricMock, metricType: 'views' });

      metricTypes.push('views');

      const result = service.computeMetricsRows(metrics, 2, metricTypes);

      expect(result.length).toBe(3);

    });

    it('should fill the last row with null values to reach maxColumn', () => {

      const metrics: Metric[] = [];
      const metricTypes: string[] = [];

      metrics.push({ ...metricMock, metricType: 'views' });

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
};
