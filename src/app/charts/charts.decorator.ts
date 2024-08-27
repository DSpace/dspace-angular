import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { ChartType } from './models/chart-type';

const chartSectionsMap = new Map();

chartSectionsMap.set(ChartType.BAR, BarChartComponent);
chartSectionsMap.set(ChartType.BAR_HORIZONTAL, BarChartComponent);
chartSectionsMap.set(ChartType.LINE, LineChartComponent);
chartSectionsMap.set(ChartType.PIE, PieChartComponent);

/**
 * @deprecated
 */
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
