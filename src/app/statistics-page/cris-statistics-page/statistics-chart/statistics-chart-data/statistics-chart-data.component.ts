import { Component, Inject, OnInit } from '@angular/core';

import { Observable, of } from 'rxjs';

import { ChartType } from '../../../../charts/models/chart-type';
import { ChartData } from '../../../../charts/models/chart-data';
import { ChartSeries } from '../../../../charts/models/chart-series';
import { REPORT_DATA } from '../../../../core/statistics/data-report.service';

import { Point, UsageReport } from '../../../../core/statistics/models/usage-report.model';

import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';

import { ExportService } from '../../../../core/export-service/export.service';

@Component({
  selector: 'ds-search-chart-filter',
  template: ``,
})
/**
 * Component that is being injected by wrapper and obtains the report information
 */
export class StatisticsChartDataComponent implements OnInit {

  /**
   * For the ChartType
   */
  chartType: any = ChartType;
  /**
   * Used to set width and height of the chart
   */
  view: any[] = null;
  /**
   * Emits an array of ChartSeries with values found for this chart
   */
  results: Observable<ChartSeries[] | ChartData[]>;
  /**
   * Loading utilized for export functions to disable buttons
   */
  isLoading = false;
  /**
   * Loading utilized for export functions to disable buttons
   */
  isSecondLoading = false;

  constructor(
    @Inject(REPORT_DATA) public report: UsageReport,
    private exportService: ExportService
  ) {
  }

  ngOnInit() {
    // super.ngOnInit();
    this.results = this.getInitData();
  }

  select(data) {
    /* tslint:disable-next-line */
    // const queryParam = this.router['browserUrlTree'].queryParamMap.params;
    // const key = this.filterConfig.paramName;
    // let value = queryParam[this.filterConfig.paramName];
    // if (queryParam[key]) {
    //   if (queryParam[key].indexOf(data.extra.value) !== -1) {
    //     value.splice(value.indexOf(data.extra.value), 1);
    //   } else {
    //     value.push(data.extra.value);
    //   }
    // } else {
    //   value = value ? value : [];
    //   value.push(data.extra.value);
    // }
    // this.router.navigate(this.getSearchLinkParts(), {
    //   queryParams: {
    //     [key]: [...value],
    //   },
    //   queryParamsHandling: 'merge',
    // });
  }

  /**
   * Download chart as image in png version.
   */
  downloadPng() {
    const node = document.getElementById('chart');
    this.isLoading = true;
    htmlToImage.toBlob(node)
      .then((blob) => {
        saveAs(blob, this.report.reportType + '.png');
        this.isLoading = false;
      });
  }

  /**
   * Download chart as image in jpeg version.
   */
  downloadJpeg() {
    const node = document.getElementById('chart');
    this.isSecondLoading = true;

    htmlToImage.toBlob(node)
      .then((blob) => {
        saveAs(blob, this.report.reportType + '.jpeg');
        this.isSecondLoading = false;
      });
  }

  /**
   * Export the table information in excel mode.
   */
  exportExcel() {
    this.isLoading = true;
    this.exportService.export('xlsx', 'dataTable', this.report.reportType, true).subscribe(() => {
      this.isLoading = false;
    });
  }

  /**
   * Export the table information in csv mode.
   */
  exportCsv() {
    this.isSecondLoading = true;
    this.exportService.export('csv', 'dataTable', this.report.reportType, true).subscribe(() => {
      this.isSecondLoading = false;
    });
  }

  /**
   * Parse information as needed by charts can be overriden
   */
  protected getInitData(): Observable<ChartSeries[] | ChartData[]> {
    let key = 'views';

    if (!!this.report.points[0]) {
      key = Object.keys(this.report.points[0].values)[0];
    }

    return of(this.report.points.map(
      (point: Point) => {
        return {
          name: point.label,
          value: point.values[key],
          extra: point,
        };
      }));
  }

}
