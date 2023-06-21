import {
  CLARIN_LICENSE_REQUIRED_INFO,
  ClarinLicenseRequiredInfo
} from './clarin-license.resource-type';
import { isEmpty } from '../../../shared/empty.util';

/**
 * The Clarin License REST/API returns license.confirmation as number and this serializer converts it to the
 * appropriate string message and vice versa.
 */
export const ClarinLicenseRequiredInfoSerializer = {

  Serialize(requiredInfoArray: ClarinLicenseRequiredInfo[]): string {
    if (isEmpty(requiredInfoArray)) {
      return '';
    }

    // sometimes the requiredInfoArray is string
    if (typeof requiredInfoArray === 'string') {
      return requiredInfoArray;
    }

    let requiredInfoString = '';
    requiredInfoArray.forEach(requiredInfo => {
      requiredInfoString += requiredInfo.name + ',';
    });

    // remove `,` from end of the string
    requiredInfoString = requiredInfoString.substring(0, requiredInfoString.length - 1);
    return requiredInfoString;
  },

  Deserialize(requiredInfoString: string): string[] {
    const requiredInfoArray = requiredInfoString.split(',');
    if (isEmpty(requiredInfoArray)) {
      return [];
    }

    const clarinLicenseRequiredInfo = [];
    requiredInfoArray.forEach(requiredInfo => {
      if (isEmpty(requiredInfo)) {
        return;
      }
      requiredInfo = requiredInfo.trim();
      clarinLicenseRequiredInfo.push(
       Object.assign(new ClarinLicenseRequiredInfo(), {
         id: clarinLicenseRequiredInfo.length,
         value: CLARIN_LICENSE_REQUIRED_INFO[requiredInfo],
         name: requiredInfo
       })
      );
    });
    return clarinLicenseRequiredInfo;
  }
};
