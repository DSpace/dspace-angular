import {
  DynamicInputModel,
  DynamicTextAreaModel,
  DynamicFormGroupModel,
  DynamicFormControlModel,
} from '@ng-dynamic-forms/core';

export const BITSTREAM_FORM_MODEL: DynamicFormControlModel[] = [

  new DynamicFormGroupModel(
    {
      id: 'files-data',
      group: [

        new DynamicInputModel(
          {
            id: 'title',
            label: 'Title',
            placeholder: 'Title'
          },
          {
            element: {
              container: 'p-0',
              label: 'col-form-label'
            },
            grid: {
              host: 'col-md-12'
            }
          }
        ),

        new DynamicTextAreaModel(
          {
            id: 'description',
            label: 'Description',
            placeholder: 'Description',
            rows: 5
          },
          {
            element: {
              container: 'p-0',
              label: 'col-form-label'
            },
            grid: {
              host: 'col-md-12'
            }
          }
        )
      ]
    },
    {
      element: {
        control: 'form-row'
      }
    }
  )
];
