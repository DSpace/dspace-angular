import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';
import { UsageReport } from '../../../../../app/core/statistics/models/usage-report.model';
import { VarDirective } from '../../../../../app/shared/utils/var.directive';
import { CollectionStatisticsPageComponent as BaseComponent } from '../../../../../app/statistics-page/collection-statistics-page/collection-statistics-page.component';

@Component({
  selector: 'ds-themed-collection-statistics-page',
  styleUrls: ['./collection-statistics-page.component.scss'],
  templateUrl: './collection-statistics-page.component.html',
  imports: [
    CommonModule,
    ThemedLoadingComponent,
    TranslateModule,
    VarDirective,
  ],
})
export class CollectionStatisticsPageComponent extends BaseComponent implements OnInit {

  private titleService = inject(Title);

  override ngOnInit(): void {
    super.ngOnInit();
    this.titleService.setTitle('Collection Statistics');
  }

  getReportKeys(report: UsageReport): string[] {
    return report.points.length > 0 ? Object.keys(report.points[0].values) : [];
  }

  getSortedPoints(report: UsageReport) {
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const toNum = (label: string) => {
      const parts = label.trim().split(' ');
      const month = months.indexOf(parts[0]);
      const year = parseInt(parts[1], 10);
      return isNaN(year) || month === -1 ? 0 : year * 12 + month;
    };
    return [...report.points].sort((a, b) => toNum(b.label) - toNum(a.label));
  }
}
