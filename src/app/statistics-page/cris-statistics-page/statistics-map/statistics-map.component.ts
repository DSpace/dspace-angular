import { Component, Inject, Input, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { UsageReport } from '../../../core/statistics/models/usage-report.model';
import { GoogleChartComponent, GoogleChartInterface, GoogleChartType } from 'ng2-google-charts';
import { ExportImageType, ExportService } from '../../../core/export-service/export.service';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
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

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Chart ElementRef
   */
  @ViewChild('googleChartRef') googleChartRef: GoogleChartComponent;

  exportImageType = ExportImageType;

  exportImageTypes = [
    { type: ExportImageType.png, label: 'PNG' },
    { type: ExportImageType.jpeg, label: 'JPEG/JPG' }
  ];

  protected exportService: ExportService;

  constructor(
    @Inject(PLATFORM_ID) protected platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      import('../../../core/export-service/browser-export.service').then((s) => {
        this.exportService = new s.BrowserExportService(this.platformId);
      });
    } else {
      import('../../../core/export-service/server-export.service').then((s) => {
        this.exportService = new s.ServerExportService();
      });
    }
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
      chartType: GoogleChartType.GeoChart,
      dataTable: [
        this.chartColumns,
        ...this.data
      ],
      options: { 'title': this.report.reportType }
    };
  }

  /**
   * Export the map as an image
   * @param type of export
   */
   exportMapAsImage(type: ExportImageType){
    this.isLoading$.next(true);
    const chart = this.googleChartRef.wrapper.getChart();
    const imageURI: string = chart?.getImageURI();
    this.exportService.exportImageWithBase64(imageURI, type, this.report.reportType, this.isLoading$);
  }
}
