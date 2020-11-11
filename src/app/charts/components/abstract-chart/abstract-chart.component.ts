import { Component, EventEmitter, Inject } from '@angular/core';
import { ChartData } from '../../../shared/models/chart-data';
import { ChartSeries } from '../../../shared/models/chart-series';

@Component({
  selector: 'ds-abstract-chart',
  template: '<span></span>'
})
export class AbstractChartComponent {

  constructor(
    @Inject('view') public view: any[],
    @Inject('results') public results: ChartData[] | ChartSeries[],
    @Inject('animations') public animations: boolean,
    @Inject('legend') public legend: boolean,
    @Inject('legendTitle') public legendTitle: string,
    @Inject('legendPosition') public legendPosition: string,
    @Inject('select') public select: EventEmitter<string>,
  ) {
  }

  onSelect(data): void {
    this.select.emit(data);
  }

}
