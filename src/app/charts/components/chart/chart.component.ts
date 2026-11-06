import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  Type,
} from '@angular/core';
import { hasValue } from '@dspace/shared/utils/empty.util';
import { Observable } from 'rxjs';

import { fadeIn } from '../../../shared/animations/fade';
import { rendersChartType } from '../../charts.decorator';
import { ChartData } from '../../models/chart-data';
import { ChartSeries } from '../../models/chart-series';
import { ChartType } from '../../models/chart-type';

@Component({
  selector: 'ds-chart',
  styleUrls: ['./chart.component.scss'],
  templateUrl: './chart.component.html',
  animations: [fadeIn],
  imports: [
    NgComponentOutlet,
  ],
})
export class ChartComponent implements OnInit, OnChanges {

  /**
   * A view to represent chart width & height.
   */
  @Input()
  view: any[];

  /**
   * A results to show data on chart.
   */
  @Input()
  results: Observable<ChartData[] | ChartSeries[]>;

  /**
   * flag to show/hide animations.
   */
  @Input()
  animations: boolean;

  /**
   * flag to show/hide legend.
   */
  @Input() legend: boolean;

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
   * The resolved chart component constructor to render via `ngComponentOutlet`.
   */
  public chartContentComponent: Type<Component>;

  /**
   * flag to add more record from left.
   */
  @Input()
  enableScrollToLeft: boolean;

  /**
   * flag to add more record from right.
   */
  @Input()
  enableScrollToRight: boolean;

  /**
   * Emits an event when the user load more data
   */
  @Output()
  showMore = new EventEmitter();

  /**
   * flag to display more button
   */
  @Input()
  isLastPage: Observable<boolean>;

  /**
   * Set current Page
   */
  @Input()
  currentPage: Observable<number>;

  /**
   * Set horizontal chart label.
   */
  @Input()
  xAxisLabel: string;

  /**
   * Set vertical chart label.
   */
  @Input()
  yAxisLabel: string;

  constructor(
    private injector: Injector,
    private cdr: ChangeDetectorRef,
  ) {}

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
        { provide: 'enableScrollToLeft', useFactory: () => this.enableScrollToLeft, deps: [] },
        { provide: 'enableScrollToRight', useFactory: () => this.enableScrollToRight, deps: [] },
        { provide: 'showMore', useFactory: () => this.showMore, deps: [] },
        { provide: 'isLastPage', useFactory: () => this.isLastPage, deps: [] },
        { provide: 'currentPage', useFactory: () => this.currentPage, deps: [] },
        { provide: 'type', useFactory: () => this.type, deps: [] },
        { provide: 'xAxisLabel', useFactory: () => this.xAxisLabel, deps: [] },
        { provide: 'yAxisLabel', useFactory: () => this.yAxisLabel, deps: [] },
      ],
      parent: this.injector,
    });
    void this.resolveChartContent();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (hasValue(changes.type) && !changes.type.isFirstChange()) {
      void this.resolveChartContent();
    }
  }

  /**
   * Resolve the chart component that matches the current chart type and store it for rendering.
   * The lookup is asynchronous (lazy import), so mark the view for check once it resolves to
   * ensure `ngComponentOutlet` picks up the resolved component within change detection.
   */
  async resolveChartContent(): Promise<void> {
    this.chartContentComponent = await rendersChartType(this.type) as Type<Component>;
    this.cdr.markForCheck();
  }
}
