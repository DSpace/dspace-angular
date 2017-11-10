import {
  DynamicInputModel,
  DynamicTextAreaModel,
  DynamicFormGroupModel,
  DynamicFormControlModel, DynamicSelectModel, DynamicDatePickerModel,
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
        ),
      ]
    },
    {
      element: {
        control: 'form-row'
      }
    }
  )
];

export const BITSTREAM_FORM_POLICIES_GROUP: DynamicFormGroupModel =
  new DynamicFormGroupModel(
    {
      id: 'files-policies',
      group: [

        new DynamicSelectModel(
          {
            id: 'policies',
            label: 'Access policies',
            options: [ ]
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

        new DynamicDatePickerModel(
          {
            id: 'policy-date',
            inline: false,
            label: 'Until'
          },
          {
            element: {
              container: 'p-0',
              label: 'col-form-label'
            },
            grid: {
              host: 'col-md-6'
            }
          }
        ),

        new DynamicSelectModel(
          {
            id: 'policy-group',
            label: 'Group',
            options: [ ]
          },
          {
            element: {
              container: 'p-0',
              label: 'col-form-label'
            },
            grid: {
              host: 'col-md-6'
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
  );
