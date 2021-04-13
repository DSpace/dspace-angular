import { Pipe, PipeTransform } from '@angular/core';

import { UsageReport } from '../../../core/statistics/models/usage-report.model';

@Pipe({ name: 'dsFilterMap' })

export class FilterMapPipe implements PipeTransform {

  transform(reports: UsageReport[], map) {
    if ( map === true ) {
      return reports.filter(report => { return report.viewMode === 'map'; });
    } else {
      return reports.filter(report => { return report.viewMode !== 'map'; });
    }
    return reports;
  }

}
