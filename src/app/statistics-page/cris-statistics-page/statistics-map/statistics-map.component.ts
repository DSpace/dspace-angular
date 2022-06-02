import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { UsageReport } from '../../../core/statistics/models/usage-report.model';
import { GoogleChartInterface } from 'ng2-google-charts';
import { ExportImageType, ExportService } from '../../../core/export-service/export.service';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'ds-statistics-map',
  templateUrl: './statistics-map.component.html',
  styleUrls: ['./statistics-map.component.scss']
})
// @renderChartFor(StatisticsType['map'])
export class StatisticsMapComponent implements OnInit {

  /**
   * The report points to display as markers in the map
   */
  @Input() report: UsageReport;

  /**
   * Geo Chart Object that is utilized by the google chart component, of type GoogleChartInterface
   */
  public geoChart: GoogleChartInterface;

  /**
   * Parsed data that will be shown in the chart
   */
  data = [];

  /**
   * Chart Columns needed to be shown in the tooltip
   */
  chartColumns = [];
  /**
   * Loading utilized for export functions to disable buttons
   */
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  /**
   * Loading utilized for export functions to disable buttons
   */
  isSecondLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  /**
   * Chart ElementRef
   */
  @ViewChild('googleChartRef') googleChartRef: ElementRef;

  constructor(
    private exportService: ExportService
  ) {
  }

  ngOnInit(): void {
    if ( !!this.report && !!this.report.points && this.report.points.length > 0 ) {
      this.getData();
    }
  }

  /**
   * Get the data information and columns information
   */
  getData() {
    const keyColumn = this.report.points[0].type;
    const valueColumn = Object.keys(this.report.points[0].values)[0];

    this.chartColumns = [keyColumn, valueColumn];

    this.report.points.forEach( (point) => {
      const idAndLabel = {v: point.id, f: point.label};
      this.data.push([
        idAndLabel, point.values[valueColumn]
      ]);
    });

    this.geoChart = {
      chartType: 'GeoChart',
      dataTable: [
        this.chartColumns,
        ...this.data
      ],
      options: { 'title': this.report.reportType }
    };

  }

  /**
   * Download map as image in png version.
   */
  downloadPng() {
    this.isLoading.next(false);
    const node = this.googleChartRef.nativeElement;
    this.exportService.exportAsImage(node, ExportImageType.png, this.report.reportType, this.isLoading);
  }

  /**
   * Download map as image in jpeg version.
   */
  downloadJpeg() {
    this.isSecondLoading.next(false);
    const node = this.googleChartRef.nativeElement;
    this.exportService.exportAsImage(node, ExportImageType.jpeg, this.report.reportType, this.isSecondLoading);
  }

}
