// import { HttpClient } from '@angular/common/http';
import { Injectable,InjectionToken } from '@angular/core';
import { UsageReport } from './models/usage-report.model';
/**
 * A service to maintain report data through the injected components
 */

export const REPORT_DATA: InjectionToken<UsageReport> = new InjectionToken<UsageReport>('usageReport');


@Injectable()
export class DataReportService {

  selectedReport: UsageReport;

  setReport(report) {
    this.selectedReport = report;
  }

  getReport() {
    return this.selectedReport;
  }

}
