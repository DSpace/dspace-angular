import { Component, Input, OnInit } from '@angular/core';
import { UsageReport } from '../../../core/statistics/models/usage-report.model';
import { GoogleChartInterface } from 'ng2-google-charts';


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
      this.data.push([
        point.label, point.values[valueColumn]
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



}
