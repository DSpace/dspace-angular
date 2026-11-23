import {
  AsyncPipe,
  DOCUMENT,
  NgClass,
  SlicePipe,
} from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import {
  NativeWindowRef,
  NativeWindowService,
} from '@dspace/core/services/window.service';
import { REPORT_DATA } from '@dspace/core/statistics/data-report.service';
import { UsageReport } from '@dspace/core/statistics/models/usage-report.model';
import { TranslateModule } from '@ngx-translate/core';

import { AlertComponent } from '../../../../shared/alert/alert.component';
import { BtnDisabledDirective } from '../../../../shared/btn-disabled.directive';
import { CreateLinkPipe } from '../../statistics-pipes/create-link.pipe';
import { EntityTypeEnum } from '../../statistics-pipes/entity-type.enum';
import { StatisticsChartDataComponent } from '../statistics-chart-data/statistics-chart-data.component';

@Component({
  selector: 'ds-statistics-table',
  templateUrl: './statistics-table.component.html',
  styleUrls: ['./statistics-table.component.scss'],
  imports: [
    AlertComponent,
    AsyncPipe,
    BtnDisabledDirective,
    CreateLinkPipe,
    NgClass,
    SlicePipe,
    TranslateModule,
  ],
})
/**
 * Component that represents a table for report
 */
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
    @Inject(PLATFORM_ID) protected platformId: any,
    @Inject(NativeWindowService) protected _window: NativeWindowRef,
    @Inject(DOCUMENT) protected document: any,
  ) {
    super(report, categoryType, platformId, _window, document);
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
