import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { fadeIn } from '../../../shared/animations/fade';
import { renderChartFor } from '../../charts.decorator';
import { ChartType } from '../../models/chart-type';
import { AbstractChartComponent } from '../abstract-chart/abstract-chart.component';
import { ChartData } from '../../models/chart-data';
import { ChartSeries } from '../../models/chart-series';

@Component({
  selector: 'ds-bar-chart',
  styleUrls: ['./bar-chart.component.scss'],
  templateUrl: './bar-chart.component.html',
  animations: [fadeIn],
})
@renderChartFor(ChartType.BAR)
export class BarChartComponent extends AbstractChartComponent implements OnInit {

  /**
   * A boolean representing if chart has a scrollbar
   */
  hasScrollbar = false;

  /**
   * flag to show/hide xAxis Line.
   */
  xAxis = true;

  /**
   * flag to show/hide yAxis Line.
   */
  yAxis = true;

  @ViewChild('chartArea', { static: true }) chartArea: ElementRef;

  /**
   * The width of the chart div container
   * @private
   */
  private chartContainerWidth: number;

  /**
   * Initialize the component, setting up the bundle and bitstream within the item
   */
  ngOnInit(): void {
    super.ngOnInit();
    if (!this.chartContainerWidth) {
      this.chartContainerWidth = this.chartArea.nativeElement.offsetWidth;
    }
    this.subs.push(
      this.chartData.subscribe((data: ChartData[] | ChartSeries[]) => {
        this.setViewSize(data.length);
      })
    );
  }

  /**
   * Return the chart data
   */
  getResults(): ChartData[] | ChartSeries[] {
    return (!this.enableScrollToLeft) ? this.chartData.value : this.chartData.value.reverse();
  }

  /**
   * Used to set view size
   */
  setViewSize(resultSize: number) {
    if (resultSize > 10) {
      this.hasScrollbar = true;
      const newWidth = this.chartContainerWidth + (this.chartContainerWidth / 2);
      this.view = [newWidth, this.chartArea.nativeElement.height];
    }

  }

}
