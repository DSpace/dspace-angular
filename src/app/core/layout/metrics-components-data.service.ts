import { Metric } from '../shared/metric.model';
import { CrisLayoutMetricRow } from './models/tab.model';

/**
 * A service responsible for managing metrics objects
 */
export class MetricsComponentsDataService {

  /**
   * Get matching metrics for item.
   */
  getMatchingMetrics(metrics: Metric[], maxColumn: number, metricTypes: string[]): CrisLayoutMetricRow[] {
    if (maxColumn == null || maxColumn <= 0) {
      maxColumn = 3;
    }
    const metricRows = this.computeMetricsRows(metrics, maxColumn, metricTypes);

    return metricRows;
  }

  computeMetricsRows(itemMetrics: Metric[], maxColumn, metricTypes: string[]): CrisLayoutMetricRow[] {

    // support
    const typeMap = {};
    metricTypes.forEach((type) => typeMap[type] = type);

    // filter, enrich, order
    const metrics = itemMetrics
      .filter((metric) => typeMap[metric.metricType])
      .map((metric) => {
        return { ...metric, position: typeMap[metric.metricType].position };
      })
      .sort((metric) => metric.position);

    // chunker
    const totalRow = Math.ceil(metrics.length / maxColumn);
    const metricRows = [];
    for (let row = 0; row < totalRow; row++) {
      const metricsInRow = [];
      for (let j = 0; j < maxColumn; j++) {
        const i = row * maxColumn + j;
        metricsInRow.push(i < metrics.length ? metrics[i] : null);
      }
      metricRows.push({ metrics: metricsInRow });
    }

    // final result
    return metricRows;

  }

}
