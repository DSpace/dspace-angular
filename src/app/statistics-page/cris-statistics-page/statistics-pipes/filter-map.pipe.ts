import {
  Pipe,
  PipeTransform,
} from '@angular/core';

import { UsageReport } from '../../../core/statistics/models/usage-report.model';

@Pipe({
  name: 'dsFilterMap',
  standalone: true,
})

export class FilterMapPipe implements PipeTransform {

  transform(reports: UsageReport[], map) {
    if ( map === true ) {
      return reports.filter(report => { return report.viewMode?.toString() === 'map'; });
    } else {
      return reports.filter(report => { return report.viewMode?.toString() !== 'map'; });
    }
    return reports;
  }

}
