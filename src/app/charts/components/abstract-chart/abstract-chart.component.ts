import { Component, EventEmitter, Inject, OnInit } from '@angular/core';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { ChartData } from '../../models/chart-data';
import { ChartSeries } from '../../models/chart-series';
import { ChartType } from '../../models/chart-type';
import { hasValue } from '../../../shared/empty.util';

@Component({
  template: ''
})
export abstract class AbstractChartComponent implements OnInit {

  public chartData: BehaviorSubject<ChartData[] | ChartSeries[]> = new BehaviorSubject<ChartData[] | ChartSeries[]>([]);

  /**
   * Array to track all subscriptions and unsubscribe them onDestroy
   * @type {Array}
   */
  protected subs: Subscription[] = [];

  constructor(
    @Inject('view') public view: any[],
    @Inject('results') public results: Observable<ChartData[] | ChartSeries[]>,
    @Inject('animations') public animations: boolean,
    @Inject('legend') public legend: boolean,
    @Inject('legendTitle') public legendTitle: string,
    @Inject('legendPosition') public legendPosition: string,
    @Inject('select') public select: EventEmitter<string>,
    @Inject('enableScrollToLeft') public enableScrollToLeft: boolean,
    @Inject('enableScrollToRight') public enableScrollToRight: boolean,
    @Inject('showMore') public showMore: EventEmitter<string>,
    @Inject('isLastPage') public isLastPage: Observable<boolean>,
    @Inject('currentPage') public currentPage: Observable<number>,
    @Inject('type') public type: ChartType
  ) {
  }

  /**
   * Initialize the chart data
   */
  ngOnInit(): void {
    this.subs.push(
      this.results.pipe(distinctUntilChanged())
        .subscribe((results: ChartData[] | ChartSeries[]) => {
          this.chartData.next(results);
        })
    );
  }

  /**
   * Used to select chart data
   * @param data
   */
  onSelect(data): void {
    this.select.emit(data);
  }

  /**
   * Used to load more data
   */
  loadMoreData(): void {
    this.showMore.emit();
  }

  /**
   * Unsubscribe from all subscriptions
   */
  ngOnDestroy(): void {
    this.subs
      .filter((subscription) => hasValue(subscription))
      .forEach((subscription) => subscription.unsubscribe());
  }

}
