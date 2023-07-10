import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';

import { StatisticsType } from '../../statistics-type.model';
import { renderChartFor } from '../../cris-statistics-element-decorator';
import { StatisticsChartDataComponent } from '../statistics-chart-data/statistics-chart-data.component';
import { REPORT_DATA } from '../../../../core/statistics/data-report.service';
import { UsageReport } from '../../../../core/statistics/models/usage-report.model';
import { EntityTypeEnum } from '../../../../cris-layout/enums/entity-type.enum';

@Component({
  selector: 'ds-statistics-table',
  templateUrl: './statistics-table.component.html',
  styleUrls: ['./statistics-table.component.scss'],
})
/**
 * Component that represents a table for report
 */
@renderChartFor(StatisticsType.table)
export class StatisticsTableComponent extends StatisticsChartDataComponent implements OnInit {
  /**
   * Boolean indicating whether the usage report has data
   */
  hasData: boolean;

  /**
   * The table headers
   */
  headers: string[] = [];

  /**
   * Array to store entity types that need to be converted to link,
   * in order to check from the template if point's label it should be a simple label or a link
   * @memberof StatisticsTableComponent
   */
  entityTypesToConvertToLink = [
    EntityTypeEnum.Item,
    EntityTypeEnum.Bitstream,
    EntityTypeEnum.Collection,
    EntityTypeEnum.Community,
  ];

  constructor(
    @Inject(REPORT_DATA) public report: UsageReport,
    @Inject('categoryType') public categoryType: string,
    @Inject(PLATFORM_ID) protected platformId: Object
  ) {
    super(report, categoryType, platformId);
  }

  /**
   * Check if report has information and if data is present to show in the view
   * Insert table headers
   */
  ngOnInit() {
    this.hasData = !!this.report && this.report.points.length > 0;
    if (this.hasData) {
      const point = this.report.points[0];
      this.headers.push(point.type);
      const pointValues = point.values;
      for (const valueKey of Object.keys(pointValues)) {
        this.headers.push(valueKey);
      }
    }
  }
}
