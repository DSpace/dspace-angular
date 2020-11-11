import { ChartType } from '../shared/enums/chart-type';

const chartSectionsMap = new Map();
export function renderChartFor(chartType: ChartType) {
  return function decorator(objectElement: any) {
    if (!objectElement) {
      return;
    }
    chartSectionsMap.set(chartType, objectElement);
  };
}

export function rendersChartType(chartType: ChartType) {
  return chartSectionsMap.get(chartType);
}
