import {
  ClsConfig,
  DynamicDatePickerModelConfig,
  DynamicFormGroupModel,
  DynamicFormControlModel,
  DynamicFormArrayModelConfig,
  DynamicInputModel,
  DynamicSelectModelConfig,
  DynamicTextAreaModel, DynamicInputModelConfig,
} from '@ng-dynamic-forms/core';

export const BITSTREAM_METADATA_FORM_MODEL: DynamicFormControlModel[] = [

  new DynamicFormGroupModel(
    {
      id: 'metadata',
      group: [

        new DynamicInputModel(
          {
            id: 'dc_title',
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
            id: 'dc_description',
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

export const BITSTREAM_ACCESS_CONDITIONS_FORM_ARRAY_CONFIG: DynamicFormArrayModelConfig = {
  id: 'accessConditions',
  initialCount: 1,
  groupFactory: null,
};
export const BITSTREAM_ACCESS_CONDITIONS_FORM_ARRAY_CLS: ClsConfig = {
  grid: {
    group: 'form-row'
  }
};

export const BITSTREAM_FORM_ACCESS_CONDITION_TYPE_CONFIG: DynamicSelectModelConfig<any> = {
  id: 'name',
  label: 'Access condition type',
  options: []
};
export const BITSTREAM_FORM_ACCESS_CONDITION_TYPE_CLS: ClsConfig = {
  element: {
    container: 'p-0',
    label: 'col-form-label'
  },
  grid: {
    host: 'col-md-10'
  }
};

export const BITSTREAM_FORM_ACCESS_CONDITION_START_DATE_CONFIG: DynamicDatePickerModelConfig = {
  id: 'startDate',
  label: 'From',
  placeholder: 'from',
  inline: false,
  toggleIcon: 'fa fa-calendar',
  relation: [
    {
      action: 'ENABLE',
      connective: 'OR',
      when: [
        {
          id: 'name',
          value: 'embargo'
        },
        {
          id: 'name',
          value: 'lease'
        },
      ]
    }
  ]
};
export const BITSTREAM_FORM_ACCESS_CONDITION_START_DATE_CLS: ClsConfig = {
  element: {
    container: 'p-0',
    label: 'col-form-label'
  },
  grid: {
    host: 'col-md-4'
  }
};

export const BITSTREAM_FORM_ACCESS_CONDITION_END_DATE_CONFIG: DynamicDatePickerModelConfig = {
  id: 'endDate',
  label: 'Until',
  placeholder: 'until',
  inline: false,
  toggleIcon: 'fa fa-calendar',
  relation: [
    {
      action: 'ENABLE',
      connective: 'OR',
      when: [
        {
          id: 'name',
          value: 'embargo'
        },
        {
          id: 'name',
          value: 'lease'
        },
      ]
    }
  ]
};
export const BITSTREAM_FORM_ACCESS_CONDITION_END_DATE_CLS: ClsConfig = {
  element: {
    container: 'p-0',
    label: 'col-form-label'
  },
  grid: {
    host: 'col-md-4'
  }
};

export const BITSTREAM_FORM_ACCESS_CONDITION_HIDDEN_GROUP_CONFIG: DynamicInputModelConfig = {
  id: 'hiddenGroupUUID',
  inputType: 'hidden',
  value: null
}

export const BITSTREAM_FORM_ACCESS_CONDITION_GROUPS_CONFIG: DynamicSelectModelConfig<any> = {
  id: 'groupUUID',
  label: 'Group',
  options: [],
  relation: [
    {
      action: 'ENABLE',
      connective: 'OR',
      when: [
        {
          id: 'name',
          value: 'embargo'
        },
        {
          id: 'name',
          value: 'lease'
        },
      ]
    }
  ]
};
export const BITSTREAM_FORM_ACCESS_CONDITION_GROUPS_CLS: ClsConfig = {
  element: {
    container: 'p-0',
      label: 'col-form-label'
  },
  grid: {
    host: 'col-sm-10'
  }
};
