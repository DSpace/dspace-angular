import { MetricsComponent } from '../../core/layout/models/metrics-component.model';
import { METRICSCOMPONENT } from '../../core/layout/models/metrics-component.resource-type';

export const metricsComponent: MetricsComponent = {
  id: '1',
  type: METRICSCOMPONENT,
  metrics: ['views'],
  _links: {
    self: {
      href: 'https://rest.api/rest/api/metricscomponent/1'
    }
  }
};
