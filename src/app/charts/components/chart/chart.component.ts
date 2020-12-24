import { Component, EventEmitter, Injector, Input, OnInit, Output, SimpleChanges } from '@angular/core';

import { fadeIn } from '../../../shared/animations/fade';
import { ChartType } from '../../models/chart-type';
import { ChartSeries } from '../../models/chart-series';
import { ChartData } from '../../models/chart-data';
import { rendersChartType } from '../../charts.decorator';

@Component({
  selector: 'ds-chart',
  styleUrls: ['./chart.component.scss'],
  templateUrl: './chart.component.html',
  animations: [fadeIn],
})
export class ChartComponent implements OnInit {

  /**
   * A view to represent chart width & height.
   */
  @Input()
  view: any[];

  /**
   * A results to show data on chart.
   */
  @Input()
  results: ChartData[] | ChartSeries[];

  /**
   * flag to show/hide animations.
   */
  @Input()
  animations: boolean;

  /**
   * flag to show/hide legend.
   */
  @Input()
  legend: boolean;

  /**
   * Set legend title.
   */
  @Input()
  legendTitle: string;

  /**
   * Set legend position.
   */
  @Input()
  legendPosition: string;

  /**
   * The chart type selection
   */
  @Input() type: ChartType = ChartType.BAR;

  /**
   * Emits an event when the user select values on chart.
   */
  @Output() select = new EventEmitter();

  /**
   * Injector to inject a chart component with the @Input parameters
   * @type {Injector}
   */
  public objectInjector: Injector;

  /**
   * The chart type enum
   */
  chartType = ChartType;

  constructor(private injector: Injector) {}

  ngOnInit(): void {
    this.objectInjector = Injector.create({
      providers: [
        { provide: 'view', useFactory: () => this.view, deps: [] },
        { provide: 'results', useFactory: () => this.results, deps: [] },
        { provide: 'animations', useFactory: () => this.animations, deps: [] },
        { provide: 'legend', useFactory: () => this.legend, deps: [] },
        {
          provide: 'legendTitle',
          useFactory: () => this.legendTitle,
          deps: [],
        },
        {
          provide: 'legendPosition',
          useFactory: () => this.legendPosition,
          deps: [],
        },
        { provide: 'select', useFactory: () => this.select, deps: [] },
      ],
      parent: this.injector,
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.ngOnInit();
  }

  /**
   * Find the correct component based on the chart's type
   */
  getChartContent() {
    return rendersChartType(this.type);
  }
}
