import isEqual from 'lodash/isEqual';
import { environment } from '../../../../../environments/environment';
import { MetricVisualizationConfig } from '../../../../../config/metric-visualization-config.interfaces';
import { Metric } from '../../../../core/shared/metric.model';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dsMetricStyleConfig',
})
export class MetricStyleConfigPipe implements PipeTransform {
  /**
   * List of configured metric's style in the environment
   *
   * @memberof MetricRowComponent
   */
  public style: MetricVisualizationConfig[] = environment.metricVisualizationConfig;

  transform(metric: Metric): unknown {
    if (metric) {
      let metricClass = 'alert alert-warning'; // default style

      // check if metric has a preconfigured style
      const metricTypeConfig = this.style.find((x) => isEqual(x.type, metric.metricType));
      if (metricTypeConfig) {
        metric.icon = metricTypeConfig.icon;
        metricClass = metricTypeConfig.class;
      }

      const classes: any = {};
      // classes used to set rules related to metric type behavior
      classes[metric.metricType] = true;
      const classlist = {
        ...classes,
        'metric-container': true,
      };
      classlist[metricClass] = true;

      return classlist;
    } else {
      return {};
    }
  }
}
