import { Pipe, PipeTransform } from '@angular/core';
import { isEmpty } from '../empty.util';
import { ClarinLicenseRequiredInfo } from '../../core/shared/clarin/clarin-license.resource-type';

/**
 * Pipe to join Extended Clarin License Label value with ','
 */
@Pipe({
  name: 'dsCLicenseRequiredInfo'
})
export class ClarinLicenseRequiredInfoPipe implements PipeTransform {
  transform(value: ClarinLicenseRequiredInfo[]): string {
    if (!Array.isArray(value)) {
      return value;
    }

    if (isEmpty(value)) {
      return '';
    }

    const requiredInfo = [];
    value.forEach((clarinLicenseRequiredInfo: ClarinLicenseRequiredInfo) => {
      requiredInfo.push(clarinLicenseRequiredInfo.name);
    });

    return requiredInfo.join(', ');
  }
}

