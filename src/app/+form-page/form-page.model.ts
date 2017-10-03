import {
  DynamicCheckboxModel,
  DynamicCheckboxGroupModel,
  DynamicInputModel,
  DynamicSelectModel,
  DynamicRadioGroupModel,
  DynamicTextAreaModel,
  DynamicFormArrayModel,
  DynamicFormGroupModel
} from '@ng-dynamic-forms/core';
import { Observable } from 'rxjs/Observable';

export const MY_DYNAMIC_FORM_MODEL = [

  new DynamicInputModel({

    id: 'exampleInput',
    label: 'Example Input',
    maxLength: 42,
    placeholder: 'example input'
  }),

  new DynamicRadioGroupModel<string>({

    id: 'exampleRadioGroup',
    label: 'Example Radio Group',
    options: [
      {
        label: 'Option 1',
        value: 'option-1',
      },
      {
        label: 'Option 2',
        value: 'option-2'
      },
      {
        label: 'Option 3',
        value: 'option-3'
      }
    ],
    value: 'option-3'
  }, {
    element: {
      container: 'row',
      control: 'btn-primary',
      label: 'col-form-label'
    },
    grid: {
      control: 'col-sm-9',
      label: 'col-sm-3'
    }
  }),

  new DynamicCheckboxModel({

    id: 'exampleCheckbox',
    label: 'I do agree'
  })
];

export const MY_DYNAMIC_FORM_MODEL2 = [

  new DynamicInputModel({

    id: 'exampleInput',
    label: 'Example Input',
    maxLength: 42,
    placeholder: 'example input'
  }),

  new DynamicCheckboxModel({

    id: 'exampleCheckbox',
    label: 'I do agree'
  })
];
