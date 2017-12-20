import { DynamicCheckboxModel, DynamicFormControlModel } from '@ng-dynamic-forms/core';

export const SECTION_LICENSE_FORM_MODEL: DynamicFormControlModel[] = [

  new DynamicCheckboxModel(
    {
      id: 'granted',
      label: 'I confirm the license above',
      required: true,
      validators: {
        required: null
      },
      errorMessages: {
        required: 'You must accept the license'
      }
    }
  )
];
