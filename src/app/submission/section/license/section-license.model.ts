import { DynamicCheckboxModel, DynamicFormControlModel } from '@ng-dynamic-forms/core';

export const SECTION_LICENSE_FORM_MODEL: DynamicFormControlModel[] = [

  new DynamicCheckboxModel(
    {
      id: 'acceptanceDate',
      label: 'I confirm the information given above'
    }
  )
];
