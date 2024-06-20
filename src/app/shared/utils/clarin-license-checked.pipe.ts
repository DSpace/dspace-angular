import { Pipe, PipeTransform } from '@angular/core';
import { isEmpty } from '../empty.util';
import { ClarinLicenseRequiredInfo } from '../../core/shared/clarin/clarin-license.resource-type';

/**
 * Pipe to mark checkbox or input to true/false based on the input form data.
 * This Pipe is used for editing Clarin Licenses.
 */
@Pipe({
  name: 'dsCheckedLicense'
})
export class ClarinLicenseCheckedPipe implements PipeTransform {

  /**
   * If the clarinLicenseLabels contains clarinLicenseLabel return true otherwise return false
   * Compare Ids
   * @param clarinLicenseProp to compare
   * @param clarinLicenseProps all extended clarin license labels or non extended clarin license label in array
   */
  transform(clarinLicenseProp: any | ClarinLicenseRequiredInfo, clarinLicenseProps: any[]): boolean {
    let contains = false;
    if (isEmpty(clarinLicenseProp) || isEmpty(clarinLicenseProps)) {
      return contains;
    }
    clarinLicenseProps.forEach(cll => {
      if (cll.name === clarinLicenseProp.name) {
        contains = true;
      }
    });
    return contains;
  }
}
