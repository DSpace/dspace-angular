import { MetricsComponent } from "../../core/layout/models/metrics-component.model";
import { METRICSCOMPONENT } from "../../core/layout/models/metrics-component.resource-type";

export const metricsComponent: MetricsComponent = {
  id: '1',
  type: METRICSCOMPONENT,
  metrics: [{
    id: 1,
    type: "views",
    position: 0
  }],
  _links: {
    self: {
      href: 'https://rest.api/rest/api/metricscomponent/1'
    }
  }
};
