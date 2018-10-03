import { WorkspaceitemSectionFormObject } from './workspaceitem-section-form.model';
import { WorkspaceitemSectionLicenseObject } from './workspaceitem-section-license.model';
import { WorkspaceitemSectionUploadObject } from './workspaceitem-section-upload.model';
import { isNotEmpty, isNotNull } from '../../../shared/empty.util';
import { FormFieldLanguageValueObject } from '../../../shared/form/builder/models/form-field-language-value.model';
import { WorkspaceitemSectionRecycleObject } from './workspaceitem-section-recycle.model';
import { WorkspaceitemSectionDetectDuplicateObject } from './workspaceitem-section-deduplication.model';
import { FormFieldMetadataValueObject } from '../../../shared/form/builder/models/form-field-metadata-value.model';

export class WorkspaceitemSectionsObject {
  [name: string]: WorkspaceitemSectionDataType;

}

export function isServerFormValue(obj: any): boolean {
  return (typeof obj === 'object'
    && obj.hasOwnProperty('value')
    && obj.hasOwnProperty('language')
    && obj.hasOwnProperty('authority')
    && obj.hasOwnProperty('confidence')
    && obj.hasOwnProperty('place'))
}

export function normalizeSectionData(obj: any) {
  let result: any = obj;
  if (isNotNull(obj)) {
    // If is an Instance of FormFieldMetadataValueObject normalize it
    if (typeof obj === 'object' && isServerFormValue(obj)) {
      // If authority property is set normalize as a FormFieldMetadataValueObject object
      /* NOTE: Data received from server could have authority property equal to null, but into form
         field's model is required a FormFieldMetadataValueObject object as field value, so double-check in
         field's parser and eventually instantiate it */
      // if (isNotEmpty(obj.authority)) {
      //   result = new FormFieldMetadataValueObject(obj.value, obj.language, obj.authority, (obj.display || obj.value), obj.place, obj.confidence);
      // } else if (isNotEmpty(obj.language)) {
      //   const languageValue = new FormFieldLanguageValueObject(obj.value, obj.language);
      //   result = languageValue;
      // } else {
      //   // Normalize as a string value
      //   result = obj.value;
      // }
      result = new FormFieldMetadataValueObject(obj.value, obj.language, obj.authority, (obj.display || obj.value), obj.place, obj.confidence);
    } else if (Array.isArray(obj)) {
      result = [];
      obj.forEach((item, index) => {
        result[index] = normalizeSectionData(item);
      });
    } else if (typeof obj === 'object') {
      result = Object.create({});
      Object.keys(obj)
        .forEach((key) => {
          result[key] = normalizeSectionData(obj[key]);
        });
    }
  }
  return result;
}

export type WorkspaceitemSectionDataType
  = WorkspaceitemSectionUploadObject
  | WorkspaceitemSectionFormObject
  | WorkspaceitemSectionLicenseObject
  | WorkspaceitemSectionRecycleObject
  | WorkspaceitemSectionDetectDuplicateObject
  | string;
